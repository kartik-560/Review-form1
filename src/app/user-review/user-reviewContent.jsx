"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const reviewSchema = z.object({
    rating: z.number().min(1, "Rating is required").max(10),
    reason_ids: z.array(z.number()),
    description: z.string().optional(),
    images: z.array(z.instanceof(File)).optional(),
    location: z
        .object({
            latitude: z.number(),
            longitude: z.number(),
            address: z.string().optional(),
        })
        .nullable(),
});

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
];

const translations = {
    en: {
        title: "Public Washroom Review",
        subtitle: "Help others by sharing your washroom experience.",
        ratingLabel: "Overall Rating *",
        fields: {
            name: "Name (Optional)",
            email: "Email (Optional)",
            phone: "Phone Number (Optional)",
            additional: "Additional Comments (Optional)",
            selectIssues: "Select Observed Issues (Optional):",
            uploadPhotos: "Upload Photos (Optional - Max 3)",
            washroomLocation: "Washroom Location *",
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
            skip: "Skip for Now",
            shareWhatsApp: "Share on WhatsApp",
            downloadReceipt: "Download Receipt",
            copyToken: "Copy Token",
            continue: "Continue",
            takephoto: "Take Photo",
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
        },
        campaign: {
            title: "Jagruk Nagrik Abhiyan",
            subtitle: "Aware Citizen Campaign",
            description: "Help us improve public facilities by sharing your contact details!",
            optionalNote: "This is optional - you can skip if you prefer.",
            tokenLabel: "Your Token Number",
            contactInfo: "Your Contact Information",
            shareMessage: "Share your contribution with others",
            enterDetails: "Would you like to be part of the Aware Citizen Campaign?",
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
        title: "सार्वजनिक शौचालय समीक्षा",
        subtitle: "अपना अनुभव साझा करके दूसरों की मदद करें।",
        ratingLabel: "कुल रेटिंग *",
        fields: {
            name: "नाम (वैकल्पिक)",
            email: "ईमेल (वैकल्पिक)",
            phone: "फ़ोन नंबर (वैकल्पिक)",
            additional: "अतिरिक्त टिप्पणियाँ (वैकल्पिक)",
            selectIssues: "देखी गई समस्याएँ चुनें (वैकल्पिक):",
            uploadPhotos: "फ़ोटो अपलोड करें (वैकल्पिक - अधिकतम 3)",
            washroomLocation: "शौचालय का स्थान *",
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
            skip: "अभी छोड़ें",
            shareWhatsApp: "व्हाट्सएप पर शेयर करें",
            downloadReceipt: "रसीद डाउनलोड करें",
            copyToken: "टोकन कॉपी करें",
            continue: "जारी रखें",
            takephoto: " फोटो लें",
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
        },
        campaign: {
            title: "जागरूक नागरिक अभियान",
            subtitle: "सचेत नागरिक अभियान",
            description: "अपने संपर्क विवरण साझा करके सार्वजनिक सुविधाओं को बेहतर बनाने में हमारी मदद करें!",
            optionalNote: "यह वैकल्पिक है - आप चाहें तो छोड़ सकते हैं।",
            tokenLabel: "आपका टोकन नंबर",
            contactInfo: "आपकी संपर्क जानकारी",
            shareMessage: "अपना योगदान दूसरों के साथ साझा करें",
            enterDetails: "क्या आप सचेत नागरिक अभियान का हिस्सा बनना चाहेंगे?",
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
        title: "सार्वजनिक शौचालय पुनरावलोकन",
        subtitle: "तुमचा अनुभव शेअर करून इतरांना मदत करा.",
        ratingLabel: "एकूण रेटिंग *",
        fields: {
            name: "नाव (ऐच्छिक)",
            email: "ईमेल (ऐच्छिक)",
            phone: "फोन नंबर (ऐच्छिक)",
            additional: "अतिरिक्त टिप्पण्या (ऐच्छिक)",
            selectIssues: "नोट केलेल्या समस्या निवडा (ऐच्छिक):",
            uploadPhotos: "फोटो अपलोड करा (ऐच्छिक - कमाल 3)",
            washroomLocation: "शौचालय स्थान *",
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
            skip: "आता सोडा",
            shareWhatsApp: "व्हाट्सअॅपवर शेअर करा",
            downloadReceipt: "पावती डाउनलोड करा",
            copyToken: "टोकन कॉपी करा",
            continue: "सुरू ठेवा",
            takephoto: "फोटो घ्या",
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
        },
        campaign: {
            title: "जागरूक नागरिक अभियान",
            subtitle: "जागरूक नागरिक मोहीम",
            description: "तुमचे संपर्क तपशील शेअर करून सार्वजनिक सुविधा सुधारण्यात आमची मदत करा!",
            optionalNote: "हे ऐच्छिक आहे - तुम्हाला हवे असल्यास सोडू शकता.",
            tokenLabel: "तुमचा टोकन नंबर",
            contactInfo: "तुमची संपर्क माहिती",
            shareMessage: "तुमचे योगदान इतरांसोबत शेअर करा",
            enterDetails: "तुम्हाला जागरूक नागरिक मोहिमेचा भाग व्हायचे आहे का?",
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

const JagrukNagrikPopup = ({ isOpen, onClose, reviewData, lang, onSubmitWithDetails, onSkip }) => {
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState(1);
    const [contactDetails, setContactDetails] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});
    const [tokenNumber, setTokenNumber] = useState("");

    const t = translations[lang].campaign;
    const tMsg = translations[lang].messages;
    const tBtn = translations[lang].buttons;

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setContactDetails({ name: "", email: "", phone: "" });
            setErrors({});
            setTokenNumber("");
        }
    }, [isOpen]);

    if (!isOpen || !reviewData) return null;

    const validateContactForm = () => {
        const newErrors = {};

        // Only validate if user has entered something
        if (contactDetails.name.trim() || contactDetails.email.trim() || contactDetails.phone.trim()) {
            if (!contactDetails.name.trim()) {
                newErrors.name = tMsg.nameRequired;
            }

            if (!contactDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
                newErrors.email = tMsg.emailRequired;
            }

            if (contactDetails.phone && contactDetails.phone.length < 10) {
                newErrors.phone = tMsg.phoneInvalid;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (validateContactForm()) {
            const success = await onSubmitWithDetails(contactDetails);
            if (success) {
                const generatedToken = `JNA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                setTokenNumber(generatedToken);
                setStep(2);
            }
        }
    };

    const handleSkip = () => {
        onSkip();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tokenNumber);
        setCopied(true);
        toast.success(tMsg.tokenCopied);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = () => {
        const message = `🏆 ${t.title}!\n\nI just contributed to improving public facilities!\n\nToken: ${tokenNumber}\nName: ${contactDetails.name}\n\nJoin the movement for cleaner public spaces! 🚻✨`;
        const url = `https://wa.me/${contactDetails.phone || ''}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const downloadReceipt = () => {
        const receiptContent = `
=================================
JAGRUK NAGRIK ABHIYAN
Aware Citizen Campaign
=================================

Token Number: ${tokenNumber}
Date: ${new Date().toLocaleString()}

Contributor Details:
Name: ${contactDetails.name}
Email: ${contactDetails.email}
${contactDetails.phone ? `Phone: ${contactDetails.phone}` : ''}

Thank you for contributing to 
improving public facilities!

=================================
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `JNA-Receipt-${tokenNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp">
                {/* Decorative Header */}
                <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-8 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
                            <Award className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
                        <p className="text-green-100 text-sm font-medium">{t.subtitle}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {step === 1 ? (
                        <>
                            {/* Contact Form Step */}
                            <div className="text-center">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-700 text-lg mb-2 font-semibold">{t.enterDetails}</p>
                                <p className="text-gray-500 text-sm">{t.optionalNote}</p>
                            </div>

                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <User className="h-4 w-4 mr-2" />
                                        {translations[lang].fields.name}
                                    </label>
                                    <input
                                        type="text"
                                        value={contactDetails.name}
                                        onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        placeholder={translations[lang].placeholders.name}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {translations[lang].fields.email}
                                    </label>
                                    <input
                                        type="email"
                                        value={contactDetails.email}
                                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        placeholder={translations[lang].placeholders.email}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {translations[lang].fields.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        value={contactDetails.phone}
                                        onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                                        placeholder={translations[lang].placeholders.phone}
                                        maxLength={10}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSkip}
                                    className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-300 transition-all font-medium"
                                >
                                    {tBtn.skip}
                                </button>
                                <button
                                    onClick={handleContinue}
                                    className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                                >
                                    <span>{tBtn.continue}</span>
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success Step */}
                            <div className="text-center">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-600 text-lg">{t.description}</p>
                            </div>

                            {/* Token Number - Highlighted */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                                <p className="text-sm font-medium text-gray-600 mb-2 text-center">
                                    {t.tokenLabel}
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-3xl font-bold text-green-700 tracking-wider">
                                        {tokenNumber}
                                    </span>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                        title={tBtn.copyToken}
                                    >
                                        {copied ? (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <Copy className="h-5 w-5 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Contact Information */}
                            {(contactDetails.name || contactDetails.email || contactDetails.phone) && (
                                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
                                        {t.contactInfo}
                                    </h3>
                                    {contactDetails.name && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <User className="h-5 w-5 text-gray-500" />
                                            <span className="text-sm">{contactDetails.name}</span>
                                        </div>
                                    )}
                                    {contactDetails.email && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                            <span className="text-sm break-all">{contactDetails.email}</span>
                                        </div>
                                    )}
                                    {contactDetails.phone && (
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Phone className="h-5 w-5 text-gray-500" />
                                            <span className="text-sm">{contactDetails.phone}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 text-center font-medium">
                                    {t.shareMessage}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={shareOnWhatsApp}
                                        className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 font-medium"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        <span className="text-sm">{tBtn.shareWhatsApp}</span>
                                    </button>
                                    <button
                                        onClick={downloadReceipt}
                                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
                                    >
                                        <Download className="h-5 w-5" />
                                        <span className="text-sm">{tBtn.downloadReceipt}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                {tBtn.close}
                            </button>
                        </>
                    )}
                </div>
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
    const companyId = searchParams.get('companyId');
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(reviewSchema),
        mode: "onChange",
        defaultValues: {
            rating: 0,
            reason_ids: [],
            description: "",
            images: [],
            location: null,
        },
    });

    const rating = watch("rating");
    const selectedReasons = watch("reason_ids");

    const handleImagesChange = (newImages) => {
        setImages(newImages);
        setValue("images", newImages, { shouldValidate: true });
    };

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
        setValue("location", newLocation, { shouldValidate: true });
    };

    const handleRatingChange = (newRating) => {
        setValue("rating", newRating, { shouldValidate: true });
    };

    const handleReasonToggle = (reasonId) => {
        const updated = selectedReasons.includes(reasonId)
            ? selectedReasons.filter((id) => id !== reasonId)
            : [...selectedReasons, reasonId];
        setValue("reason_ids", updated);
    };

    const submitReview = async (data, contactDetails = null) => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();

            // Only add contact details if they exist
            if (contactDetails?.name) formData.append("name", contactDetails.name);
            if (contactDetails?.email) formData.append("email", contactDetails.email);
            if (contactDetails?.phone?.trim()) formData.append("phone", contactDetails.phone);

            if (companyId) formData.append("companyId", companyId);

            formData.append("rating", data.rating.toString());
            formData.append("description", data.description || "");
            formData.append("reason_ids", JSON.stringify(data.reason_ids));
            formData.append("latitude", data.location.latitude.toString());
            formData.append("longitude", data.location.longitude.toString());
            formData.append("location_id", locationId);

            images.forEach((img) => {
                formData.append("images", img);
            });

            const res = await fetch("https://review-backend-two.vercel.app/api/user-review", {
                method: "POST",
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
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

            // ✅ Store the review ID for later update
            if (result.reviewId) {
                setSubmittedReviewId(result.reviewId);
            }

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

    const handleFormSubmit = async (data) => {

        const success = await submitReview(data, null);

        if (success) {
            setReviewData(data);
            setShowSuccessPopup(true);
            reset();
            setImages([]);
            setLocation(null);
        }
    };

    const submitReviewWithContactDetails = async (contactDetails) => {
        if (!submittedReviewId) {
            console.error("No review ID to update");
            return false;
        }

        if (!contactDetails.name && !contactDetails.email && !contactDetails.phone) {
            return true; // Nothing to update
        }

        try {
            const res = await fetch(
                `https://review-backend-two.vercel.app/api/user-review/${submittedReviewId}`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                    },
                    body: JSON.stringify({
                        name: contactDetails.name || undefined,
                        email: contactDetails.email || undefined,
                        phone: contactDetails.phone || undefined,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to update contact details");
            }

            toast.success("Contact details updated successfully!");
            return true;

        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Failed to update contact details");
            return false;
        }
    };

    const handleSkipContactDetails = () => {
        toast.success("Thank you for your review!");
        setShowSuccessPopup(false);
        setReviewData(null);
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
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="p-6 sm:p-8 space-y-8"
                    >
                        <LocationDetector
                            location={location}
                            onLocationChange={handleLocationChange}
                            locationLabel={translations[lang].fields.washroomLocation}
                            buttonText={translations[lang].buttons.getCurrentLocation}
                            detectingText={translations[lang].buttons.detecting}
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">
                                {translations[lang].messages.locationRequired}
                            </p>
                        )}

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
                            {errors.rating && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.rating.message}
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
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                                <CheckSquare className="h-4 w-4 mr-1" />
                                {translations[lang].fields.selectIssues}
                            </label>
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
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {translations[lang].fields.additional}
                            </label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-black"
                                placeholder={translations[lang].placeholders.description}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
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
                onSkip={handleSkipContactDetails}
            />
        </>
    );
}
