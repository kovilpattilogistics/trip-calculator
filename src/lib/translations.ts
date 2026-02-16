export type Language = 'en' | 'ta';

export interface Translation {
    // Step 0 - Landing
    landing_subtitle_1: string;
    landing_subtitle_2: string;
    landing_desc: string;
    start_btn: string;
    features_ev: string;
    features_fixed_price: string;
    features_pod: string;
    features_instant: string;
    coverage_title: string;

    // Step 1
    step1_title: string;
    step1_subtitle: string;
    // Step 1 - Section 1
    trip_type_label: string;
    direct_trip_label: string;
    direct_trip_desc: string;
    multi_stop_label: string;
    multi_stop_desc: string;
    // Step 1 - Section 2
    service_level_label: string;
    std_label: string;
    std_desc: string;
    std_badge: string;
    std_info: string;
    full_vehicle_label: string;
    full_vehicle_desc: string;
    full_vehicle_badge: string;
    full_vehicle_info: string;
    urgent_label: string;
    urgent_desc: string;
    urgent_badge: string;
    urgent_info: string;
    continue_btn: string;

    // Step 2
    step2_title: string;
    step2_subtitle: string;
    pickup_label: string;
    pickup_placeholder: string;
    drop_label: string;
    drop_placeholder: string;
    end_label: string;
    stops_label: string;
    add_stop_btn: string;
    dist_label: string;
    route_ready: string;
    map_empty: string;

    // Step 2 Errors
    pickup_error: string;
    drop_error: string;
    end_error: string;

    // Step 3
    step3_title: string;
    weight_input_label: string;
    weight_unit: string;
    min_weight_error: string;
    bulk_weight_info: string;
    vehicle_capacity_label: string;
    vehicle_type_small: string;
    vehicle_type_large: string;
    product_type_label: string;
    product_type_placeholder: string;
    waiting_time_label: string;
    waiting_unit: string;
    waiting_info: string;
    get_price_btn: string;

    // Step 4
    quote_ready: string;
    back_btn: string;
    trip_details_label: string;
    distance_label: string;
    weight_summary_label: string;
    waiting_label: string;
    fare_breakdown_label: string;
    base_charge_label: string;
    stops_charge_label: string;
    weight_charge_label: string;
    distance_charge_label: string;
    waiting_charge_label: string;
    total_label: string;
    view_breakdown_btn: string;
    hide_breakdown_btn: string;
    book_whatsapp_btn: string;
    call_us_btn: string;
    restart_btn: string;

    // Components
    detect_btn: string;
    map_btn: string;
    detecting: string;

    // Promo
    switch_promo: string;
}

export const translations: Record<Language, Translation> = {
    en: {
        // Step 0
        landing_subtitle_1: "Get your price in",
        landing_subtitle_2: "30 seconds",
        landing_desc: "Instant quotes for Kovilpatti & surrounding areas",
        start_btn: "START CALCULATION",
        features_ev: "EV Delivery",
        features_fixed_price: "Fixed Price",
        features_pod: "POD Included",
        features_instant: "Instant Book",
        coverage_title: "Zone-A Coverage",

        step1_title: "What are you sending?",
        step1_subtitle: "Choose the best option for your goods.",
        trip_type_label: "1. Trip Type (Click one)",
        direct_trip_label: "Direct Trip",
        direct_trip_desc: "Pickup ➔ Drop",
        multi_stop_label: "Multi-Stop",
        multi_stop_desc: "Many Drops (2+)",
        service_level_label: "2. Service Level (Choose speed/cost)",
        std_label: "Standard (Shared)",
        std_desc: "Cheapest option. Goods share the truck.",
        std_badge: "💰 Best Value",
        std_info: "We combine your goods with others. It takes a bit longer but saves you money!",
        full_vehicle_label: "Full Vehicle",
        full_vehicle_desc: "Private truck just for you.",
        full_vehicle_badge: "⭐ Private",
        full_vehicle_info: "You get the whole truck. No sharing. Best for large loads or sensitive items.",
        urgent_label: "Urgent",
        urgent_desc: "Priority speed. Same day delivery.",
        urgent_badge: "⚡ Fastest",
        urgent_info: "We drop everything to deliver your goods immediately. Costs a bit more.",
        continue_btn: "CONTINUE",

        step2_title: "Where are we going?",
        step2_subtitle: "Enter start and end points.",
        pickup_label: "Pickup Point (Start)",
        pickup_placeholder: "Where to pick up?",
        drop_label: "Drop Point",
        drop_placeholder: "Where to deliver?",
        end_label: "Final Destination",
        stops_label: "Stops Between",
        add_stop_btn: "+ Add Stop in Between",
        dist_label: "Total Distance",
        route_ready: "Route Ready ✓",
        map_empty: "Enter locations to see map",

        // Step 2 Errors
        pickup_error: "* Pickup location is required",
        drop_error: "* Drop location is required",
        end_error: "* End point location is required",

        // Step 3
        step3_title: "What are you sending?",
        weight_input_label: "Weight (Kg)",
        weight_unit: "Kilograms",
        min_weight_error: "⚠️ Minimum weight is 10 kg",
        bulk_weight_info: "ℹ️ For bulk orders >500kg, better rates may apply via call.",
        vehicle_capacity_label: "Vehicle Capacity",
        vehicle_type_small: "🏍️ Bike / Scooter",
        vehicle_type_large: "🚛 Cargo Auto / Tata Ace",
        product_type_label: "Product Type",
        product_type_placeholder: "e.g. Oil Cans, Rice Bags, Electronics...",
        waiting_time_label: "Expected Unloading Time",
        waiting_unit: "Hours",
        waiting_info: "💡 First 1 hour is <strong>FREE</strong>! Extra hours: ₹200/hour.",
        get_price_btn: "GET PRICE",

        // Step 4
        quote_ready: "✨ Quote Ready",
        back_btn: "Back",
        trip_details_label: "Trip Details",
        distance_label: "Distance",
        weight_summary_label: "Weight",
        waiting_label: "Waiting",
        fare_breakdown_label: "Fare Breakdown",
        base_charge_label: "Base Charge",
        stops_charge_label: "Stops Charge",
        weight_charge_label: "Weight Charge",
        distance_charge_label: "Distance Charge",
        waiting_charge_label: "Waiting Charge",
        total_label: "Total",
        view_breakdown_btn: "📋 View breakdown",
        hide_breakdown_btn: "Hide details",
        book_whatsapp_btn: "BOOK ON WHATSAPP",
        call_us_btn: "CALL US",
        restart_btn: "RESTART",

        detect_btn: "Detect",
        map_btn: "Map",
        detecting: "Detecting...",

        switch_promo: "Switch to Tamil 👉",
    },
    ta: {
        // Step 0
        landing_subtitle_1: "வாடகை விபரம் பெற",
        landing_subtitle_2: "30 விநாடிகள்",
        landing_desc: "கோவில்பட்டி மற்றும் சுற்றுவட்டார பகுதிகளுக்கு உடனடி விலை",
        start_btn: "கணக்கிட தொடங்கவும்",
        features_ev: "EV டெலிவரி",
        features_fixed_price: "நிலையான விலை",
        features_pod: "POD உள்ளது",
        features_instant: "உடனடி புக்கிங்",
        coverage_title: "சேவை பகுதிகள் (Zone-A)",

        step1_title: "என்ன அனுப்ப வேண்டும்? 📦",
        step1_subtitle: "சிறந்த வாகனத்தை தேர்வு செய்யவும்.",
        trip_type_label: "1. பயணம் வகை (ஒன்றை தேர்வு செய்யவும்)",
        direct_trip_label: "நேரடி பயணம்",
        direct_trip_desc: "ஏற்றி ➔ இறக்க",
        multi_stop_label: "பல இடங்கள்",
        multi_stop_desc: "பல இடங்களில் இறக்க (2+)",
        service_level_label: "2. சர்வீஸ் வகை (வேகம்/விலை)",
        std_label: "ஷேரிங் (குறைந்த விலை)",
        std_desc: "சிக்கனமானது. மற்ற பொருட்களுடன் வரும்.",
        std_badge: "💰 சிக்கனம்",
        std_info: "உங்கள் பொருட்கள் மற்றவர்களுடன் வரும். சிறிது நேரம் ஆகும், ஆனால் பணம் மிச்சம்!",
        full_vehicle_label: "முழு வண்டி",
        full_vehicle_desc: "உங்களுக்கு மட்டும் தனி வண்டி.",
        full_vehicle_badge: "⭐ தனி வண்டி",
        full_vehicle_info: "முழு வண்டியும் உங்களுக்கே. யாருடனும் பகிரத் தேவையில்லை. பெரிய லோடுக்கு சிறந்தது.",
        urgent_label: "அவசரம் (Urgent)",
        urgent_desc: "வேகமாக டெலிவரி. இன்றே கிடைக்கும்.",
        urgent_badge: "⚡ மின்னல் வேகம்",
        urgent_info: "எல்லாவற்றையும் விட்டுவிட்டு உங்கள் லோடை உடனே அனுப்புவோம். கொஞ்சம் கூடுதல் செலவாகும்.",
        continue_btn: "தொடரவும்",

        step2_title: "எங்கே செல்ல வேண்டும்? 📍",
        step2_subtitle: "ஏற்றும் மற்றும் இறக்கும் இடங்களை உள்ளிடவும்.",
        pickup_label: "ஏற்றும் இடம் (Start)",
        pickup_placeholder: "எங்கே ஏற்ற வேண்டும்?",
        drop_label: "இறக்கும் இடம்",
        drop_placeholder: "எங்கே இறக்க வேண்டும்?",
        end_label: "கடைசி இடம்",
        stops_label: "இடைப்பட்ட நிறுத்தங்கள்",
        add_stop_btn: "+ நிறுத்தத்தைச் சேர்க்க",
        dist_label: "மொத்த தூரம்",
        route_ready: "பாதை தயார் ✓",
        map_empty: "வரைபடத்தைக் காண இடங்களைச் சேர்க்கவும்",

        // Step 2 Errors
        pickup_error: "* ஏற்றும் இடம் தேவை",
        drop_error: "* இறக்கும் இடம் தேவை",
        end_error: "* கடைசி இடம் தேவை",

        // Step 3
        step3_title: "என்ன அனுப்புகிறீர்கள்? 📦",
        weight_input_label: "எடை (Kg)",
        weight_unit: "கிலோகிராம்",
        min_weight_error: "⚠️ குறைந்தபட்ச எடை 10 kg",
        bulk_weight_info: "ℹ️ 500kg-க்கு மேல் இருந்தால், கால் செய்யவும்.",
        vehicle_capacity_label: "வண்டி கொள்ளளவு",
        vehicle_type_small: "🏍️ பைக் / ஸ்கூட்டர்",
        vehicle_type_large: "🚛 கார்கோ ஆட்டோ / Tata Ace",
        product_type_label: "பொருள் வகை",
        product_type_placeholder: "எ.கா. எண்ணெய் கேன்கள், அரிசி மூட்டைகள்...",
        waiting_time_label: "இறக்க ஆகும் நேரம் (Unloading Time)",
        waiting_unit: "மணிநேரம்",
        waiting_info: "💡 முதல் 1 மணிநேரம் <strong>இலவசம்</strong>! கூடுதல் நேரம்: ₹200/hour.",
        get_price_btn: "விலையை பார்",

        // Step 4
        quote_ready: "✨ வாடகை விவரம்",
        back_btn: "பின்னால்",
        trip_details_label: "பயண விவரங்கள்",
        distance_label: "தூரம்",
        weight_summary_label: "எடை",
        waiting_label: "காத்திருப்பு",
        fare_breakdown_label: "கட்டண விவரம்",
        base_charge_label: "அடிப்படை கட்டணம்",
        stops_charge_label: "நிறுத்த கட்டணம்",
        weight_charge_label: "எடை கட்டணம்",
        distance_charge_label: "தூர கட்டணம்",
        waiting_charge_label: "காத்திருப்பு கட்டணம்",
        total_label: "மொத்தம்",
        view_breakdown_btn: "📋 கட்டண விவரம் பார்",
        hide_breakdown_btn: "விவரத்தை மறை",
        book_whatsapp_btn: "வாட்ஸ்அப்பில் புக் செய்",
        call_us_btn: "கால் செய்",
        restart_btn: "முதலில் இருந்து",

        detect_btn: "கண்டுபிடி",
        map_btn: "மேப்",
        detecting: "தேடுகிறது...",

        switch_promo: "Switch to English 👉",
    }
};
