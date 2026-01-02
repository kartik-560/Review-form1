"use client";

import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MessageSquare,
    CheckSquare,
    Send,
    CheckCircle,
    Award,
    Share2,
    Download,
    Copy,
    MessageCircle,
    X
} from "lucide-react";
import SmileyRating from "./SmileyRating";
import LocationDetector from "./LocationDetector";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import toast from "react-hot-toast";
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';

const commonIndianWashroomIssues = [
    { id: 1, text: "Dirty or unflushed toilets (Western or Indian)" },
    { id: 2, text: "Wet, slippery, or muddy floors" },
    { id: 3, text: "Unpleasant or strong odor" },
    { id: 4, text: "Paan / Gutka spit stains" },
    { id: 5, text: "Overflowing dustbins" },
    { id: 6, text: "General grime (stained walls, dirty mirrors)" },
    { id: 7, text: "No water in taps or for flush" },
    { id: 8, text: "Leaking taps, pipes, or cisterns" },
    { id: 9, text: "Broken or missing health faucet (jet spray)" },
    { id: 10, text: "No mug or lota available" },
    { id: 11, text: "Broken or missing toilet seat" },
    { id: 12, text: "Faulty or broken door lock/latch" },
    { id: 13, text: "Low water pressure" },
    { id: 14, text: "No hand-washing soap" },
    { id: 15, text: "No toilet paper available" },
    { id: 16, text: "Faulty hand dryer or no paper towels" },
    { id: 17, text: "Poor or no lighting" },
    { id: 18, text: "No hooks for bags or clothes" },
    { id: 19, text: "Poor ventilation (no fan or window)" },
    { id: 0, text: "No Issues" },
];

const translations = {
    en: {
        title: "Your voice cleans India |SWACHH DRISHTI",
        subtitle: "Help others by sharing your washroom experience.",
        ratingLabel: "Overall Rating *",
        fields: {
            name: "Name",
            email: "Email",
            phone: "Phone Number",
            additional: "Additional Comments (Optional)",
            selectIssues: "What did the AI miss (Optional):",
            uploadPhotos: "Upload Photos (Optional - Max 3)",
            washroomLocation: "Washroom Location *",
            noIssues: "No Issues",
            locationError: "Location Error:",
            locationDetected: "Location Detected:",
            coordinates: "Coordinates:",
        },
        placeholders: {
            name: "Your full name",
            email: "your.email@example.com",
            phone: "10-digit mobile number",
            description: "Share more details about your experience...",
        },
        buttons: {
            submit: "Submit Review",
            submitting: "Submitting Review...",
            submitAnother: "Submit Another Review",
            close: "Close",

            shareWhatsApp: "Share on WhatsApp",
            downloadReceipt: "Download Receipt",
            copyToken: "Copy Token",
            continue: "submit",
            takephoto: "Activate AI Lens",
            getCurrentLocation: "Get Current Location",
            detecting: "Detecting...",
        },
        messages: {
            thankYou: "Thank You!",
            successMessage: "Your washroom review has been submitted successfully.",
            fillRequired: "Please fill all required fields.",
            submitError: "Something went wrong. Please try again.",
            locationRequired: "Location is a required field.",
            tokenCopied: "Token number copied to clipboard!",
            nameRequired: "Name is required",
            emailRequired: "Please enter a valid email",
            phoneInvalid: "Phone must be at least 10 digits",
            contactUpdateSuccess: "Contact details updated successfully!",
            locationNotSupported: "Geolocation is not supported by this browser.",
            locationPermissionDenied: "Location access denied. Please enable location permissions.",
            locationUnavailable: "Location information is unavailable.",
            locationTimeout: "Location request timed out.",
            locationUnknownError: "An unknown error occurred while retrieving location.",
        },
        campaign: {
            title: "Swachh Drishti Abhiyan",
            subtitle: "Analysis Complete. Your voice helped in cleaning India.",
            description: "Help us improve public facilities by sharing your contact details!",
            // optionalNote: "Share your details to enter our quarterly 'Swachh Sitara Awards'. Win vouchers for helping India be cleaner",
            tokenLabel: "Your Token Number",
            contactInfo: "Your Contact Information",
            shareMessage: "Share your contribution with others",
            enterDetails: "Share your details to enter our quarterly 'Swachh Sitara Awards'. Win vouchers for helping India be cleaner",
        },
        ratingLabels: {
            veryPoor: 'Very Poor',
            poor: 'Poor',
            belowAverage: 'Below Average',
            fair: 'Fair',
            average: 'Average',
            good: 'Good',
            veryGood: 'Very Good',
            great: 'Great',
            excellent: 'Excellent',
            outstanding: 'Outstanding',
        },
        issues: [
            "Dirty or unflushed toilets (Western or Indian)",
            "Wet, slippery, or muddy floors",
            "Unpleasant or strong odor",
            "Paan / Gutka spit stains",
            "Overflowing dustbins",
            "General grime (stained walls, dirty mirrors)",
        ],
    },
    hi: {
        title: "आपकी आवाज़ भारत को स्वच्छ बनाती है | स्वच्छ दृष्टि",
        subtitle: "अपना अनुभव साझा करके दूसरों की मदद करें।",
        ratingLabel: "कुल रेटिंग *",
        fields: {
            name: "नाम ",
            email: "ईमेल ",
            phone: "फ़ोन नंबर ",
            additional: "अतिरिक्त टिप्पणियाँ (वैकल्पिक)",
            selectIssues: "AI से क्या छूट गया? (वैकल्पिक):",
            uploadPhotos: "फ़ोटो अपलोड करें (वैकल्पिक - अधिकतम 3)",
            washroomLocation: "शौचालय का स्थान *",
            noIssues: "कोई समस्या नहीं",
            locationError: "स्थान त्रुटि:",
            locationDetected: "स्थान का पता चला:",
            coordinates: "निर्देशांक:",
        },
        placeholders: {
            name: "आपका पूरा नाम",
            email: "आपका.ईमेल@उदाहरण.com",
            phone: "10 अंकों का मोबाइल नंबर",
            description: "अपने अनुभव के बारे में और बताएं...",
        },
        buttons: {
            submit: "समीक्षा जमा करें",
            submitting: "समीक्षा जमा की जा रही है...",
            submitAnother: "दूसरी समीक्षा जमा करें",
            close: "बंद करें",

            shareWhatsApp: "व्हाट्सएप पर शेयर करें",
            downloadReceipt: "रसीद डाउनलोड करें",
            copyToken: "टोकन कॉपी करें",
            continue: "जमा करें",
            takephoto: " AI लेंस सक्रिय करें",
            getCurrentLocation: "वर्तमान स्थान प्राप्त करें",
            detecting: "पता लगाया जा रहा है...",
        },
        messages: {
            thankYou: "धन्यवाद!",
            successMessage: "आपकी शौचालय समीक्षा सफलतापूर्वक जमा हो गई है।",
            fillRequired: "कृपया सभी आवश्यक फ़ील्ड भरें।",
            submitError: "कुछ गलत हुआ। कृपया फिर से कोशिश करें।",
            locationRequired: "स्थान एक आवश्यक फ़ील्ड है।",
            tokenCopied: "टोकन नंबर क्लिपबोर्ड पर कॉपी हो गया!",
            nameRequired: "नाम आवश्यक है",
            emailRequired: "कृपया एक वैध ईमेल दर्ज करें",
            phoneInvalid: "फ़ोन कम से कम 10 अंकों का होना चाहिए",
            contactUpdateSuccess: "संपर्क विवरण सफलतापूर्वक अपडेट किया गया!",
            locationNotSupported: "यह ब्राउज़र भौगोलिक स्थान का समर्थन नहीं करता।",
            locationPermissionDenied: "स्थान एक्सेस अस्वीकृत। कृपया स्थान अनुमतियाँ सक्षम करें।",
            locationUnavailable: "स्थान की जानकारी उपलब्ध नहीं है।",
            locationTimeout: "स्थान अनुरोध समय समाप्त हो गया।",
            locationUnknownError: "स्थान प्राप्त करते समय एक अज्ञात त्रुटि हुई।",
        },
        campaign: {
            title: "स्वच्छ दृष्टि अभियान",
            subtitle: "विश्लेषण पूर्ण हुआ। आपकी आवाज़ ने भारत को स्वच्छ बनाने में मदद की।",
            description: "अपने संपर्क विवरण साझा करके सार्वजनिक सुविधाओं को बेहतर बनाने में हमारी मदद करें!",
            // optionalNote: "यह वैकल्पिक है - आप चाहें तो छोड़ सकते हैं।",
            tokenLabel: "आपका टोकन नंबर",
            contactInfo: "आपकी संपर्क जानकारी",
            shareMessage: "अपना योगदान दूसरों के साथ साझा करें",
            enterDetails: "हमारे त्रैमासिक ‘स्वच्छ सितारा पुरस्कार’ में भाग लेने के लिए अपनी जानकारी साझा करें। भारत को स्वच्छ बनाने में मदद करने पर वाउचर जीतें।",
        },
        ratingLabels: {
            veryPoor: 'बहुत खराब',
            poor: 'खराब',
            belowAverage: 'औसत से कम',
            fair: 'ठीक',
            average: 'औसत',
            good: 'अच्छा',
            veryGood: 'बहुत अच्छा',
            great: 'बेहतरीन',
            excellent: 'उत्कृष्ट',
            outstanding: 'शानदार',
        },
        issues: [
            "गंदे या बिना फ्लश किए शौचालय (पश्चिमी या भारतीय)",
            "गीले, फिसलन भरे या कीचड़युक्त फर्श",
            "अप्रिय या तेज़ गंध",
            "पान / गुटखा के दाग",
            "ओवरफ्लो होते कूड़ेदान",
            "सामान्य गंदगी (दीवारों पर धब्बे, गंदे शीशे)",
        ],
    },
    mr: {
        title: "तुमचा आवाज भारत स्वच्छ करतो | स्वच्छ दृष्टि",
        subtitle: "तुमचा अनुभव शेअर करून इतरांना मदत करा.",
        ratingLabel: "एकूण रेटिंग *",
        fields: {
            name: "नाव ",
            email: "ईमेल",
            phone: "फोन नंबर",
            additional: "अतिरिक्त टिप्पण्या (ऐच्छिक)",
            selectIssues: "AI कडून काय चुकलं? (ऐच्छिक):",
            uploadPhotos: "फोटो अपलोड करा (ऐच्छिक - कमाल 3)",
            washroomLocation: "शौचालय स्थान *",
            noIssues: "कोणतीही समस्या नाही",
            locationError: "स्थान त्रुटी:",
            locationDetected: "स्थान शोधले:",
            coordinates: "निर्देशांक:",
        },
        placeholders: {
            name: "तुमचे पूर्ण नाव",
            email: "तुमचा.ईमेल@उदाहरण.com",
            phone: "10 अंकांचा मोबाइल नंबर",
            description: "तुमच्या अनुभवाबद्दल अधिक सांगा...",
        },
        buttons: {
            submit: "पुनरावलोकन सबमिट करा",
            submitting: "पुनरावलोकन सबमिट होत आहे...",
            submitAnother: "दुसरे पुनरावलोकन सबमिट करा",
            close: "बंद करा",

            shareWhatsApp: "व्हाट्सअॅपवर शेअर करा",
            downloadReceipt: "पावती डाउनलोड करा",
            copyToken: "टोकन कॉपी करा",
            continue: "सादर करा",
            takephoto: "AI लेन्स सक्रिय करा",
            getCurrentLocation: "सध्याचे स्थान मिळवा",
            detecting: "शोधत आहे...",
        },
        messages: {
            thankYou: "धन्यवाद!",
            successMessage: "तुमचे शौचालय पुनरावलोकन यशस्वीरित्या सबमिट झाले आहे.",
            fillRequired: "कृपया सर्व आवश्यक फील्ड भरा.",
            submitError: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
            locationRequired: "स्थान हे एक आवश्यक फील्ड आहे.",
            tokenCopied: "टोकन नंबर क्लिपबोर्डवर कॉपी झाला!",
            nameRequired: "नाव आवश्यक आहे",
            emailRequired: "कृपया एक वैध ईमेल प्रविष्ट करा",
            phoneInvalid: "फोन कमीतकमी 10 अंकांचा असावा",
            contactUpdateSuccess: "संपर्क तपशील यशस्वीरित्या अपडेट केले!",
            locationNotSupported: "हा ब्राउझर भौगोलिक स्थानाचे समर्थन करत नाही.",
            locationPermissionDenied: "स्थान प्रवेश नाकारला. कृपया स्थान परवानग्या सक्षम करा.",
            locationUnavailable: "स्थान माहिती उपलब्ध नाही.",
            locationTimeout: "स्थान विनंती कालबाह्य झाली.",
            locationUnknownError: "स्थान मिळवताना अज्ञात त्रुटी आली.",

        },
        campaign: {
            title: "स्वच्छ दृष्टी अभियान",
            subtitle: "विश्लेषण पूर्ण झाले. तुमच्या आवाजामुळे भारत स्वच्छ होण्यास मदत झाली.",
            description: "तुमचे संपर्क तपशील शेअर करून सार्वजनिक सुविधा सुधारण्यात आमची मदत करा!",
            // optionalNote: "हे ऐच्छिक आहे - तुम्हाला हवे असल्यास सोडू शकता.",
            tokenLabel: "तुमचा टोकन नंबर",
            contactInfo: "तुमची संपर्क माहिती",
            shareMessage: "तुमचे योगदान इतरांसोबत शेअर करा",
            enterDetails: "आमच्या त्रैमासिक ‘स्वच्छ सितारा पुरस्कार’मध्ये सहभागी होण्यासाठी तुमची माहिती शेअर करा. भारत स्वच्छ ठेवण्यास मदत केल्याबद्दल वाउचर्स जिंका",
        },
        ratingLabels: {
            veryPoor: 'अतिशय वाईट',
            poor: 'वाईट',
            belowAverage: 'सरासरीपेक्षा कमी',
            fair: 'ठीक',
            average: 'सरासरी',
            good: 'चांगले',
            veryGood: 'खूप चांगले',
            great: 'उत्तम',
            excellent: 'उत्कृष्ट',
            outstanding: 'अप्रतिम',
        },
        issues: [
            "घाणेरडे किंवा फ्लश न केलेले शौचालय (पाश्चिमात्य किंवा भारतीय)",
            "ओले, घसरणारे किंवा चिखलयुक्त मजले",
            "अप्रिय किंवा तीव्र दुर्गंध",
            "पान / गुटखा चे डाग",
            "ओसंडून वाहणारे कचरापेटी",
            "सामान्य घाण (भिंतींवर डाग, घाणेरडे आरसे)",
        ],
    },
};

const JagrukNagrikPopup = ({ isOpen, onClose, reviewData, lang, onSubmitWithDetails, }) => {
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState(1);
    const [contactDetails, setContactDetails] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});

    const t = translations[lang].campaign;
    const tMsg = translations[lang].messages;
    const tBtn = translations[lang].buttons;

    // Generate token from reviewData or create a new one
    const tokenNumber = reviewData?.tokenNumber || "";

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setContactDetails({ name: "", email: "", phone: "" });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen || !reviewData) return null;

    const validateContactForm = () => {
        const newErrors = {};

        // ✅ Check if all fields are filled
        if (!contactDetails.name.trim()) {
            newErrors.name = tMsg.nameRequired;
        }

        if (!contactDetails.email.trim()) {
            newErrors.email = tMsg.emailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
            newErrors.email = tMsg.emailRequired;
        }

        if (!contactDetails.phone.trim()) {
            newErrors.phone = tMsg.phoneInvalid;
        } else if (contactDetails.phone.trim().length < 10) {
            newErrors.phone = tMsg.phoneInvalid;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async () => {
        if (validateContactForm()) {
            const success = await onSubmitWithDetails(contactDetails);
            if (success) {
                setStep(2);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tokenNumber);
        setCopied(true);
        toast.success(tMsg.tokenCopied);
        setTimeout(() => setCopied(false), 2000);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Set colors and fonts
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 40, 'F');

        // Header
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('Swachh Drishti Abhiyan', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Contribution Receipt', 105, 30, { align: 'center' });

        // Body
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Thank you for contributing!', 20, 60);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('I just contributed to improving public facilities!', 20, 75);

        // Token Info
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Your Details:', 20, 95);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Token Number: ${tokenNumber}`, 20, 110);
        doc.text(`Name: ${contactDetails.name}`, 20, 120);
        doc.text(`Email: ${contactDetails.email}`, 20, 130);
        doc.text(`Phone: ${contactDetails.phone}`, 20, 140);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Join the movement for cleaner public spaces!', 105, 170, { align: 'center' });

        doc.setFontSize(8);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 180, { align: 'center' });

        return doc;
    };

    // Share on WhatsApp - Simple approach
    const shareOnWhatsApp = async () => {
        try {
            console.log('Share button clicked');

            // Generate PDF
            const doc = generatePDF();
            const pdfBlob = doc.output('blob');
            const fileName = `Swachh-Drishti-Receipt-${tokenNumber}.pdf`;

            // Create File object
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

            // Check if Web Share API is supported
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file]
                });
                toast.success('Shared successfully!');
            } else {
                toast.error('PDF sharing not supported. Please use a mobile device.');
            }

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share error:', error);
                toast.error('Failed to share.');
            }
        }
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-[95%] xs:max-w-md sm:max-w-lg md:max-w-xl my-auto overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
                {/* Decorative Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 xs:p-6 sm:p-8 text-white overflow-hidden flex-shrink-0">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 bg-white opacity-10 rounded-full -mr-12 -mt-12 xs:-mr-16 xs:-mt-16 sm:-mr-20 sm:-mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -ml-10 -mb-10 xs:-ml-12 xs:-mb-12 sm:-ml-16 sm:-mb-16"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 xs:p-2 transition-all z-10"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4 xs:h-5 xs:w-5" />
                    </button>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-2 xs:mb-3 sm:mb-4 animate-bounce">
                            <Award className="h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 text-blue-600" />
                        </div>
                        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 xs:mb-2 leading-tight">{t.title}</h2>
                        <p className="text-blue-100 text-xs xs:text-sm font-medium">{t.subtitle}</p>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 xs:p-6 sm:p-8 space-y-4 xs:space-y-5 sm:space-y-6">
                    {step === 1 ? (
                        <>
                            {/* Success Message */}
                            <div className="text-center">
                                <CheckCircle className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 text-blue-500 mx-auto mb-2 xs:mb-3" />
                                <p className="text-gray-700 text-base xs:text-lg mb-1 xs:mb-2 font-semibold leading-snug">{tMsg.successMessage}</p>
                            </div>

                            {/* Token Number - Show on First Step */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6">
                                <p className="text-xs xs:text-sm font-medium text-gray-600 mb-2 text-center">
                                    {t.tokenLabel}
                                </p>
                                <div className="flex items-center justify-center gap-2 xs:gap-3 flex-wrap">
                                    <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-blue-700 tracking-wider break-all">
                                        {tokenNumber}
                                    </span>

                                </div>
                            </div>

                            {/* Campaign Question */}
                            <div className="text-center">
                                <p className="text-gray-700 text-sm xs:text-base font-semibold mb-1">{t.enterDetails}</p>
                            </div>

                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-600 text-sm text-center">{errors.general}</p>
                                </div>
                            )}

                            <div className="space-y-3 xs:space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="flex items-center text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2">
                                        <User className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                                        {translations[lang].fields.name}
                                    </label>
                                    <input
                                        type="text"
                                        value={contactDetails.name}
                                        onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                                        className="w-full px-3 py-2.5 xs:px-4 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder={translations[lang].placeholders.name}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="flex items-center text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2">
                                        <Mail className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                                        {translations[lang].fields.email}
                                    </label>
                                    <input
                                        type="email"
                                        value={contactDetails.email}
                                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                        className="w-full px-3 py-2.5 xs:px-4 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder={translations[lang].placeholders.email}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="flex items-center text-xs xs:text-sm font-medium text-gray-700 mb-1.5 xs:mb-2">
                                        <Phone className="h-3.5 w-3.5 xs:h-4 xs:w-4 mr-1.5 xs:mr-2" />
                                        {translations[lang].fields.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        value={contactDetails.phone}
                                        onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                                        className="w-full px-3 py-2.5 xs:px-4 xs:py-3 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder={translations[lang].placeholders.phone}
                                        maxLength={10}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success Step - After submitting contact details */}
                            <div className="text-center">
                                <CheckCircle className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 text-blue-500 mx-auto mb-2 xs:mb-3" />
                                <p className="text-gray-600 text-sm xs:text-base sm:text-lg">{t.description}</p>
                            </div>

                            {/* Token Number */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6">
                                <p className="text-xs xs:text-sm font-medium text-gray-600 mb-2 text-center">
                                    {t.tokenLabel}
                                </p>
                                <div className="flex items-center justify-center gap-2 xs:gap-3 flex-wrap">
                                    <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-blue-700 tracking-wider break-all">
                                        {tokenNumber}
                                    </span>

                                </div>
                            </div>

                            {/* Share on WhatsApp Button */}
                            <button
                                onClick={shareOnWhatsApp}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 xs:py-3.5 sm:py-4 px-4 xs:px-6 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 font-medium text-sm xs:text-base"
                            >
                                <MessageCircle className="h-5 w-5 xs:h-6 xs:w-6" />
                                <span>{tBtn.shareWhatsApp}</span>
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-100 text-gray-700 py-2.5 xs:py-3 px-4 xs:px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm xs:text-base"
                            >
                                {tBtn.close}
                            </button>
                        </>
                    )}
                </div>

                {/* Fixed Submit Button - Only show in Step 1 */}
                {step === 1 && (
                    <div className="flex-shrink-0 p-2 xs:p-2 sm:p-4 pt-0 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-3 xs:py-3.5 sm:py-4 px-4 xs:px-6 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-medium flex items-center justify-center gap-2 text-sm xs:text-base"
                        >
                            <span>{tBtn.continue}</span>
                            <Send className="h-4 w-4 xs:h-5 xs:w-5" />
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
            animation: slideUp 0.4s ease-out;
        }
    `}</style>
        </div>


    );
};

export default function ReviewForm() {
    const [images, setImages] = useState([]);
    const [location, setLocation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [reviewData, setReviewData] = useState(null);
    const [lang, setLang] = useState("en");
    const [submittedReviewId, setSubmittedReviewId] = useState(null);
    const searchParams = useSearchParams();
    const locationId = searchParams.get('locationId') || "148";

    const [rating, setRating] = useState(0);
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [description, setDescription] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleReasonToggle = (reasonId) => {

        const updated = selectedReasons.includes(reasonId)
            ? selectedReasons.filter(id => id !== reasonId)
            : [...selectedReasons.filter(id => id !== 0), reasonId];

        setSelectedReasons(updated);
    };

    const validateForm = () => {
        if (rating === 0) {
            toast.error("Please provide a rating");
            return false;
        }

        return true;
    };

    const submitReview = async (data) => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();

            formData.append("rating", data.rating.toString());
            formData.append("description", data.description || "");
            formData.append("reason_ids", JSON.stringify(data.reasonids));

            if (data.location?.latitude && data.location?.longitude) {
                formData.append('latitude', data.location.latitude.toString());
                formData.append('longitude', data.location.longitude.toString());
            }

            formData.append("location_id", locationId);

            images.forEach((img) => {
                formData.append("images", img);
            });


            const res = await fetch(`${API_URL}/user-review`, {
                method: "POST",
                body: formData,
            });


            const contentType = res.headers.get('content-type');

            if (!contentType?.includes('application/json')) {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned an invalid response');
            }

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || result.message || "Failed to submit review");
            }

            // ✅ Store both review ID and token
            if (result.reviewId) {
                setSubmittedReviewId(result.reviewId);
            }

            // ✅ Store review data with token from backend
            setReviewData({
                rating: data.rating,
                reasonids: data.reasonids,
                description: data.description,
                location: data.location,
                images: images,
                tokenNumber: result.tokenNumber // ✅ Token from backend response
            });

            toast.success(result.message || "Review submitted successfully!");
            return true;

        } catch (err) {
            console.error("Submission error:", err);
            toast.error(err.message || "Failed to submit review");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const reviewData = {
            rating: rating,
            description: description,
            reasonids: selectedReasons,
            location: location
        };

        // ✅ Call submitReview without contact details parameter
        const success = await submitReview(reviewData);

        if (success) {
            setShowSuccessPopup(true);

            // Reset form
            setRating(0);
            setSelectedReasons([]);
            setDescription('');
            setImages([]);
            setLocation(null);
        }
    };

    const submitReviewWithContactDetails = async (contactDetails) => {
        if (!submittedReviewId) {
            console.error("No review ID to update");
            return false;
        }

        // ✅ Check if at least one field has actual content (not just whitespace)
        const hasName = contactDetails.name && contactDetails.name.trim();
        const hasEmail = contactDetails.email && contactDetails.email.trim();
        const hasPhone = contactDetails.phone && contactDetails.phone.trim();

        if (!hasName || !hasEmail || !hasPhone) {
            toast.error(translations[lang].messages.fillAllRequired || "Please fill all required fields");
            return false;
        }

        try {
            const res = await fetch(
                `${API_URL}/user-review/${submittedReviewId}`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: hasName ? contactDetails.name.trim() : undefined,
                        email: hasEmail ? contactDetails.email.trim() : undefined,
                        phone: hasPhone ? contactDetails.phone.trim() : undefined,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to update contact details");
            }

            toast.success(translations[lang].messages.contactUpdateSuccess || "Contact details updated successfully!");
            return true;

        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Failed to update contact details");
            return false;
        }
    };

    const handleNoIssuesToggle = () => {
        if (selectedReasons.includes(0)) {
            // If "No Issues" is already selected, uncheck it
            setSelectedReasons([]);
        } else {
            // If "No Issues" is not selected, select only it (clear all others)
            setSelectedReasons([0]);
        }
    };

    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        setReviewData(null);
    };

    return (
        <>
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-3">
                                    {translations[lang].title}
                                </h1>
                                <p className="text-blue-100 text-lg">
                                    {translations[lang].subtitle}
                                </p>
                            </div>
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                                className="text-blue-700 bg-white border border-white rounded-full px-3 py-1 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                            >
                                <option value="en">EN</option>
                                <option value="hi">HI</option>
                                <option value="mr">MR</option>
                            </select>
                        </div>
                    </div>
                    <form
                        onSubmit={handleFormSubmit}
                        className="p-6 sm:p-8 space-y-8"
                    >
                        <LocationDetector
                            location={location}
                            onLocationChange={handleLocationChange}
                            locationLabel={translations[lang].fields.washroomLocation}
                            buttonText={translations[lang].buttons.getCurrentLocation}
                            detectingText={translations[lang].buttons.detecting}
                            lang={lang}
                            translations={translations}
                        />


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                {translations[lang].ratingLabel}
                            </label>
                            <SmileyRating
                                rating={rating}
                                onRatingChange={handleRatingChange}
                                size={32}
                                ratingLabels={translations[lang].ratingLabels}
                            />
                            {rating === 0 && (
                                <p className="text-orange-600 text-xs mt-2">
                                    Rating is required
                                </p>
                            )}
                        </div>

                        <CloudinaryImageUploader
                            images={images}
                            onImagesChange={handleImagesChange}
                            maxImages={3}
                            maxSizeKB={500}
                            takePhotoText={translations[lang].buttons.takephoto}
                            uploadPhotosLabel={translations[lang].fields.uploadPhotos}
                        />

                        <div>
                            {/* Header with Label and No Issues checkbox */}
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    {translations[lang].fields.selectIssues}
                                </label>

                                {/* No Issues Checkbox */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedReasons.includes(0)}
                                        onChange={() => handleNoIssuesToggle()}
                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {translations[lang].fields.noIssues}
                                    </span>
                                </label>
                            </div>

                            {/* Issues Grid - Only show if "No Issues" is not selected */}
                            {!selectedReasons.includes(0) && (
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {translations[lang].issues.map((issueText, index) => (
                                        <label
                                            key={commonIndianWashroomIssues[index].id}
                                            className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedReasons.includes(commonIndianWashroomIssues[index].id)}
                                                onChange={() => handleReasonToggle(commonIndianWashroomIssues[index].id)}
                                                className="mt-0.5 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{issueText}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>



                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {translations[lang].fields.additional}
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-black"
                                placeholder={translations[lang].placeholders.description}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <span>{translations[lang].buttons.submitting}</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-6 w-6" />
                                    <span>{translations[lang].buttons.submit}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Optional Success Popup */}
            <JagrukNagrikPopup
                isOpen={showSuccessPopup}
                onClose={handleClosePopup}
                reviewData={reviewData}
                lang={lang}
                onSubmitWithDetails={submitReviewWithContactDetails}

            />
        </>
    );
}