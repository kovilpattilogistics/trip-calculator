'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useWizard } from '@/components/wizard/WizardManager';
import { MapPin, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { ZONE_A_TOWNS } from '@/lib/location-service';
import { getRoadDistance } from '@/lib/road-distance';
import { reverseGeocode, forwardGeocode } from '@/lib/reverse-geocode';
import { clsx } from 'clsx';
import { LocationPickerModal } from './LocationPickerModal';
import dynamic from 'next/dynamic';

const RouteMap = dynamic(() => import('@/components/ui/RouteMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400 text-xs">Loading map...</div>
});

export function Step2Location() {
    const { data, updateData, goToNextStep, goToPreviousStep } = useWizard();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [distance, setDistance] = useState<number>(0);
    const [activeSearchField, setActiveSearchField] = useState<string | null>(null);
    const [showErrors, setShowErrors] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState<string | null>(null);

    // Map Picker State
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [pickerField, setPickerField] = useState<string | null>(null);
    const [mapDefaults, setMapDefaults] = useState<{ lat: number; lng: number } | undefined>(undefined);

    const openMapPicker = (field: string) => {
        setPickerField(field);

        // Smart Default Center Logic
        let defaultCenter: { lat: number; lng: number } | undefined = undefined;

        // Helper to extract lat/lng from data if it exists
        const getLatLng = (key: 'pickup' | 'drop' | 'end' | string): { lat: number; lng: number } | null => {
            if (key === 'pickup') return data.pickupLatLng || null;
            if (key === 'drop') return data.dropLatLng || null;
            if (key === 'end') return data.endLatLng || null;
            if (key.startsWith('stop-')) {
                const idx = parseInt(key.split('-')[1]);
                return data.stopsLatLng?.[idx] || null;
            }
            return null;
        };

        // 1. If currently selected field has coordinates, use them (handled by modal via initialLocation usually, but we can enforce)
        const currentFieldLatLng = getLatLng(field);
        if (currentFieldLatLng) {
            defaultCenter = currentFieldLatLng;
        } else {
            // 2. If empty, calculate default based on rules
            if (field === 'pickup') {
                // Default: Kovilpatti (9.172868, 77.869002)
                defaultCenter = { lat: 9.172868, lng: 77.869002 };
            } else if (field.startsWith('stop-')) {
                const idx = parseInt(field.split('-')[1]);
                if (idx === 0) {
                    // Stop 1 defaults to Pickup location
                    defaultCenter = getLatLng('pickup') || { lat: 9.172868, lng: 77.869002 };
                } else {
                    // Stop N defaults to Stop N-1 location
                    defaultCenter = getLatLng(`stop-${idx - 1}`) || getLatLng('pickup') || { lat: 9.172868, lng: 77.869002 };
                }
            } else if (field === 'drop' || field === 'end') {
                if (data.deliveryType === 'multiple' && data.stopsLatLng && data.stopsLatLng.length > 0) {
                    // Defaults to last stop
                    const lastStopIndex = data.stopsLatLng.length - 1;
                    // Find the last valid stop latlng
                    let lastValidStop = null;
                    for (let i = lastStopIndex; i >= 0; i--) {
                        if (data.stopsLatLng[i]) {
                            lastValidStop = data.stopsLatLng[i];
                            break;
                        }
                    }
                    defaultCenter = lastValidStop || getLatLng('pickup') || { lat: 9.172868, lng: 77.869002 };
                } else {
                    // Defaults to pickup
                    defaultCenter = getLatLng('pickup') || { lat: 9.172868, lng: 77.869002 };
                }
            }
        }

        setMapDefaults(defaultCenter);
        setShowMapPicker(true);
    };

    const handleCurrentLocation = async (field: 'pickup' | 'drop' | 'end' | string) => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setDetectingLocation(field);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                try {
                    const address = await reverseGeocode(latLng);

                    if (field === 'pickup') {
                        updateData({ pickupLocation: address, pickupLatLng: latLng });
                    } else if (field === 'drop') {
                        updateData({ dropLocation: address, dropLatLng: latLng });
                    } else if (field === 'end') {
                        updateData({ endLocation: address, endLatLng: latLng });
                    } else if (field.startsWith('stop-')) {
                        const index = parseInt(field.split('-')[1]);
                        const newStops = [...data.stops];
                        newStops[index] = address;
                        const newStopsLatLng = [...(data.stopsLatLng || [])];
                        newStopsLatLng[index] = latLng;
                        updateData({ stops: newStops, stopsLatLng: newStopsLatLng });
                    }
                } catch (error) {
                    console.error('Error getting location:', error);
                    alert('Could not fetch address details');
                } finally {
                    setDetectingLocation(null);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setDetectingLocation(null);
                alert('Please enable location services to use this feature');
            },
            { enableHighAccuracy: true }
        );
    };

    // Helper: compute total road distance from all waypoints
    const computeTotalDistance = async () => {
        type LL = { lat: number; lng: number };
        const waypoints: LL[] = [];
        if (data.pickupLatLng) waypoints.push(data.pickupLatLng);
        if (data.deliveryType === 'multiple') {
            for (const s of (data.stopsLatLng || [])) { if (s) waypoints.push(s); }
            if (data.endLatLng) waypoints.push(data.endLatLng);
        } else {
            if (data.dropLatLng) waypoints.push(data.dropLatLng);
        }
        if (waypoints.length >= 2) {
            const d = await getRoadDistance(waypoints);
            setDistance(d);
        }
    };

    // Auto-recalculate distance when any coordinates change
    // Serialize stopsLatLng to avoid reference-equality re-triggers
    const stopsLatLngKey = JSON.stringify(data.stopsLatLng || []);
    useEffect(() => {
        computeTotalDistance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.pickupLatLng, data.dropLatLng, stopsLatLngKey, data.endLatLng, data.deliveryType]);

    // Build waypoints for the route map preview
    const routeWaypoints = useMemo(() => {
        const wps: { lat: number; lng: number; label: string; type: 'pickup' | 'drop' | 'stop' }[] = [];
        if (data.pickupLatLng) {
            wps.push({ ...data.pickupLatLng, label: data.pickupLocation.split(',')[0] || 'Pickup', type: 'pickup' });
        }
        if (data.deliveryType === 'multiple') {
            for (let i = 0; i < (data.stopsLatLng || []).length; i++) {
                const sll = data.stopsLatLng[i];
                if (sll) wps.push({ ...sll, label: data.stops[i]?.split(',')[0] || `Stop ${String.fromCharCode(65 + i)}`, type: 'stop' });
            }
            if (data.endLatLng) wps.push({ ...data.endLatLng, label: data.endLocation.split(',')[0] || 'End', type: 'drop' });
        } else {
            if (data.dropLatLng) wps.push({ ...data.dropLatLng, label: data.dropLocation.split(',')[0] || 'Drop', type: 'drop' });
        }
        return wps;
    }, [data]);

    const handleLocationPicked = async (location: string) => {
        // Try to parse coordinates from the location string (format: "lat, lng" or "Name, Place")
        const coordMatch = location.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
        const latLng = coordMatch
            ? { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) }
            : null;

        // Reverse geocode to get area name if we have coordinates
        let displayName = location;
        if (latLng) {
            displayName = await reverseGeocode(latLng);
        }

        if (pickerField === 'pickup') {
            updateData({ pickupLocation: displayName, ...(latLng ? { pickupLatLng: latLng } : {}) });
        } else if (pickerField === 'drop') {
            updateData({ dropLocation: displayName, ...(latLng ? { dropLatLng: latLng } : {}) });
        } else if (pickerField === 'end') {
            updateData({ endLocation: displayName, ...(latLng ? { endLatLng: latLng } : {}) });
        } else if (pickerField?.startsWith('stop-')) {
            const index = parseInt(pickerField.split('-')[1]);
            const newStops = [...data.stops];
            newStops[index] = displayName;
            const newStopsLatLng = [...(data.stopsLatLng || [])];
            newStopsLatLng[index] = latLng;
            updateData({ stops: newStops, stopsLatLng: newStopsLatLng });
        }

        setShowMapPicker(false);
        setPickerField(null);
    };

    const handleSearch = (value: string, field: 'drop' | 'end' | 'stop' | 'pickup', stopIndex?: number) => {
        if (field === 'drop') updateData({ dropLocation: value, dropLatLng: null });
        else if (field === 'end') updateData({ endLocation: value, endLatLng: null });
        else if (field === 'pickup') updateData({ pickupLocation: value, pickupLatLng: null });

        setActiveSearchField(field === 'stop' && stopIndex !== undefined ? `stop-${stopIndex}` : field);

        if (value.length > 1) {
            const filtered = ZONE_A_TOWNS.filter(town =>
                town.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = async (town: string) => {
        if (activeSearchField === 'drop') {
            updateData({ dropLocation: town });
        } else if (activeSearchField === 'end') {
            updateData({ endLocation: town });
        } else if (activeSearchField === 'pickup') {
            updateData({ pickupLocation: town });
        }
        setSuggestions([]);
        const field = activeSearchField;
        setActiveSearchField(null);

        // Forward geocode to get lat/lng
        const latLng = await forwardGeocode(town);
        if (latLng && field) {
            if (field === 'pickup') updateData({ pickupLatLng: latLng });
            else if (field === 'drop') updateData({ dropLatLng: latLng });
            else if (field === 'end') updateData({ endLatLng: latLng });
            else if (field.startsWith('stop-')) {
                const idx = parseInt(field.split('-')[1]);
                const newStopsLatLng = [...(data.stopsLatLng || [])];
                newStopsLatLng[idx] = latLng;
                updateData({ stopsLatLng: newStopsLatLng });
            }
        }
    };

    // Geocode on blur when user types a location manually (no suggestion selected)
    const handleBlurGeocode = async (field: 'pickup' | 'drop' | 'end') => {
        const value = field === 'pickup' ? data.pickupLocation
            : field === 'drop' ? data.dropLocation
                : data.endLocation;
        const currentLatLng = field === 'pickup' ? data.pickupLatLng
            : field === 'drop' ? data.dropLatLng
                : data.endLatLng;

        // Only geocode if there's text and no existing lat/lng
        if (value && value.length > 2 && !currentLatLng) {
            const latLng = await forwardGeocode(value);
            if (latLng) {
                if (field === 'pickup') updateData({ pickupLatLng: latLng });
                else if (field === 'drop') updateData({ dropLatLng: latLng });
                else if (field === 'end') updateData({ endLatLng: latLng });
            }
        }
    };

    // Validations — both pickup and drop/end are required
    const pickupValid = data.pickupLocation.length > 3;
    const dropValid = data.deliveryType === 'single'
        ? data.dropLocation.length > 3
        : data.endLocation.length > 3;
    const isValid = pickupValid && dropValid;

    const handleContinue = () => {
        if (!isValid) {
            setShowErrors(true);
            return;
        }
        setShowErrors(false);
        goToNextStep();
    };

    const InputActions = ({ field }: { field: string }) => (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
                onClick={() => handleCurrentLocation(field)}
                disabled={detectingLocation === field}
                className={clsx(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-colors border",
                    detectingLocation === field
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-white text-blue-500 border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                )}
                title="Detect Current Location"
            >
                {detectingLocation === field ? (
                    <div className="w-4 h-4 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                ) : (
                    /* Target Icon */
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                )}
            </button>
            <div className="w-px h-5 bg-gray-100 mx-0.5" />
            <button
                onClick={() => openMapPicker(field)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
                title="Pick on Map"
            >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map</span>
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-sm z-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
                <div className="flex items-center justify-between mb-2">
                    <button onClick={goToPreviousStep} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Step 2 of 4</span>
                    <div className="w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    Where are we going?
                </h2>
                <p className="text-sm text-gray-500 mt-1">Enter start and end points.</p>
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-y-auto">

                <div className="relative space-y-8">
                    {/* Visual Connector Line */}
                    <div className="absolute left-[29px] top-12 bottom-12 w-0.5 border-l-2 border-dashed border-gray-300 z-0" />

                    {/* Pickup Location */}
                    <div className="relative z-10">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                            Pickup Point <span className="text-green-600">(Start)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 z-10">
                                <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100" />
                            </div>
                            <input
                                type="text"
                                value={data.pickupLocation}
                                onChange={(e) => handleSearch(e.target.value, 'pickup')}
                                onFocus={() => setActiveSearchField('pickup')}
                                onBlur={() => handleBlurGeocode('pickup')}
                                placeholder="Where to pick up?"
                                className={clsx(
                                    "w-full pl-12 pr-[140px] py-4 rounded-xl border-2 outline-none transition-all font-medium text-lg bg-white shadow-sm",
                                    showErrors && !pickupValid
                                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                        : "border-gray-100 focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50"
                                )}
                            />
                            {showErrors && !pickupValid && (
                                <p className="text-xs text-red-500 font-medium mt-1.5 ml-1">* Pickup location is required</p>
                            )}
                            <InputActions field="pickup" />
                        </div>
                        {/* Suggestions for pickup */}
                        {activeSearchField === 'pickup' && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                {suggestions.map((town) => (
                                    <button
                                        key={town}
                                        onClick={() => selectSuggestion(town)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-3"
                                    >
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{town}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Multiple Shops: Dynamic Stops List */}
                    {data.deliveryType === 'multiple' && (
                        <div className="space-y-4 pl-0">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block ml-8">
                                Stops Between
                            </label>

                            {data.stops.map((stop, index) => (
                                <div key={index} className="relative z-10 group animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div className="relative"> {/* Use relative here to scope the button */}
                                        <div className="relative flex-1">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 z-10">
                                                <div className="w-2 h-2 rounded-full bg-gray-400 ring-4 ring-gray-100" />
                                            </div>
                                            <input
                                                type="text"
                                                value={stop}
                                                onChange={(e) => {
                                                    const newStops = [...data.stops];
                                                    newStops[index] = e.target.value;
                                                    updateData({ stops: newStops, stopsCount: newStops.length });
                                                    handleSearch(e.target.value, 'stop', index);
                                                }}
                                                placeholder={`Stop ${index + 1}`}
                                                className="w-full pl-10 pr-[170px] py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-green-50 outline-none transition-all text-sm font-medium bg-white shadow-sm"
                                            />
                                            {/* Container for Actions + Delete */}
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {/* Custom Input Actions (Detect + Map) */}
                                                <button
                                                    onClick={() => handleCurrentLocation(`stop-${index}`)}
                                                    disabled={detectingLocation === `stop-${index}`}
                                                    className={clsx(
                                                        "w-7 h-7 flex items-center justify-center rounded-lg transition-colors border",
                                                        detectingLocation === `stop-${index}`
                                                            ? "bg-green-50 text-green-600 border-green-200"
                                                            : "bg-white text-blue-500 border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                                                    )}
                                                    title="Detect"
                                                >
                                                    {detectingLocation === `stop-${index}` ? (
                                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => openMapPicker(`stop-${index}`)}
                                                    className="flex items-center justify-center w-7 h-7 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg transition-colors"
                                                    title="Pick on Map"
                                                >
                                                    <Map className="w-3.5 h-3.5" />
                                                </button>

                                                <div className="w-px h-4 bg-gray-200" />

                                                <button
                                                    onClick={() => {
                                                        const newStops = data.stops.filter((_, i) => i !== index);
                                                        updateData({ stops: newStops, stopsCount: newStops.length });
                                                    }}
                                                    className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove Stop"
                                                >
                                                    <div className="text-lg leading-none font-bold">×</div>
                                                </button>
                                            </div>

                                            {/* Suggestions for this specific input */}
                                            {activeSearchField === `stop-${index}` && suggestions.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 max-h-48 overflow-y-auto">
                                                    {suggestions.map((town) => (
                                                        <button
                                                            key={town}
                                                            onClick={() => {
                                                                const newStops = [...data.stops];
                                                                newStops[index] = town;
                                                                updateData({ stops: newStops, stopsCount: newStops.length });
                                                                setSuggestions([]);
                                                                setActiveSearchField(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 block"
                                                        >
                                                            {town}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pl-0">
                                <button
                                    onClick={() => {
                                        const newStops = [...(data.stops || []), ''];
                                        updateData({ stops: newStops, stopsCount: newStops.length });
                                    }}
                                    className="w-full py-3 bg-gray-50 border border-dashed border-gray-300 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>+ Add Stop in Between</span>
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Drop Location */}
                    <div className="relative z-10">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                            {data.deliveryType === 'single' ? 'Drop Point' : 'Final Destination'} <span className="text-red-600">(End)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 z-10">
                                <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100" />
                            </div>
                            <input
                                type="text"
                                value={data.deliveryType === 'single' ? data.dropLocation : data.endLocation}
                                onChange={(e) => handleSearch(e.target.value, data.deliveryType === 'single' ? 'drop' : 'end')}
                                onFocus={() => setActiveSearchField(data.deliveryType === 'single' ? 'drop' : 'end')}
                                onBlur={() => handleBlurGeocode(data.deliveryType === 'single' ? 'drop' : 'end')}
                                placeholder="Where to deliver?"
                                className={clsx(
                                    "w-full pl-12 pr-[140px] py-4 rounded-xl border-2 outline-none transition-all font-medium text-lg bg-white shadow-sm",
                                    showErrors && !dropValid
                                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                                        : "border-gray-100 focus:border-[var(--primary)] focus:ring-4 focus:ring-green-50"
                                )}
                            />
                            {showErrors && !dropValid && (
                                <p className="text-xs text-red-500 font-medium mt-1.5 ml-1">* {data.deliveryType === 'single' ? 'Drop' : 'End point'} location is required</p>
                            )}
                            <InputActions field={data.deliveryType === 'single' ? 'drop' : 'end'} />
                        </div>

                        {/* Suggestions */}
                        {activeSearchField && ['drop', 'end'].includes(activeSearchField) && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-30 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                {suggestions.map((town) => (
                                    <button
                                        key={town}
                                        onClick={() => selectSuggestion(town)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-3"
                                    >
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{town}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Route Map */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative z-0 mt-8" style={{ isolation: 'isolate' }}>
                    {routeWaypoints.length >= 2 ? (
                        <>
                            <div className="h-[200px] w-full">
                                <RouteMap waypoints={routeWaypoints} />
                            </div>
                            <div className="p-4 flex items-center justify-between text-sm border-t border-gray-100 bg-gray-50/50">
                                <div className="flex flex-col gap-1 min-w-0">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Distance</span>
                                    <span className="font-bold text-gray-900 text-lg">{distance} km</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full">
                                        Route Ready ✓
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-[140px] flex items-center justify-center bg-gray-50/50">
                            <div className="text-center opacity-60">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <Map className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Enter locations to see map</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white border-t border-gray-100">
                <button
                    onClick={handleContinue}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold transition-all shadow-md shadow-green-200/50 bg-gradient-to-r from-[var(--primary)] to-emerald-600 text-white hover:from-[#1b5e20] hover:to-emerald-700 transform active:scale-95"
                >
                    CONTINUE
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            {/* Map Picker Modal */}
            <LocationPickerModal
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onConfirm={handleLocationPicked}
                initialLocation={
                    pickerField === 'pickup' ? data.pickupLocation :
                        pickerField === 'drop' ? data.dropLocation :
                            pickerField === 'end' ? data.endLocation :
                                pickerField?.startsWith('stop-') ? data.stops[parseInt(pickerField.split('-')[1])] : ''
                }
                defaultLat={mapDefaults?.lat}
                defaultLng={mapDefaults?.lng}
            />

        </div>
    );
}
