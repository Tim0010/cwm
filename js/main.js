(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-dark shadow');
            } else {
                $('.fixed-top').removeClass('bg-dark shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-dark shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-dark shadow').css('top', 0);
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Causes progress
    $('.causes-progress').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    
    // Payment number copy functionality
    function copyNumber(provider) {
        let number = '';
        switch(provider) {
            case 'mtn':
                number = '+260 97X XXX XXX'; // Replace with actual number
                break;
            case 'airtel':
                number = '+260 77X XXX XXX'; // Replace with actual number
                break;
            case 'zamtel':
                number = '+260 95X XXX XXX'; // Replace with actual number
                break;
        }
        
        navigator.clipboard.writeText(number).then(() => {
            alert('Payment number copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy number:', err);
        });
    }

    // Donation form submission
    document.getElementById('donationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            amount: document.getElementById('amount').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            purpose: document.getElementById('donationPurpose').value,
            isRecurring: document.getElementById('recurringDonation').checked,
            proofType: document.getElementById('proofType').value,
            transactionCode: document.getElementById('transactionCode')?.value || '',
            screenshot: document.getElementById('paymentScreenshot')?.files[0] || null,
            isAnonymous: document.getElementById('anonymousDonation').checked,
            sendReceipt: document.getElementById('sendReceipt').checked,
            dedication: {
                type: document.getElementById('dedicationType').value,
                name: document.getElementById('dedicationName')?.value,
                message: document.getElementById('dedicationMessage')?.value
            }
        };

        // Validate form data
        if (!formData.name || !formData.phone || !formData.amount || !formData.paymentMethod || !formData.purpose) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate proof of payment
        if (!formData.proofType) {
            alert('Please select proof of payment type');
            return;
        }

        if (formData.proofType === 'screenshot' && !formData.screenshot) {
            alert('Please upload a screenshot of your payment');
            return;
        }

        if (formData.proofType === 'transaction' && !formData.transactionCode) {
            alert('Please enter the transaction code');
            return;
        }

        // Show enhanced confirmation message
        const message = `Thank you for your ${formData.isAnonymous ? 'anonymous ' : ''}${formData.isRecurring ? 'monthly' : 'one-time'} donation!
            \nAmount: ${formData.amount} ZMW
            \nPurpose: ${formData.purpose}
            ${formData.dedication.type ? `\nDedicated ${formData.dedication.type === 'memory' ? 'in memory of' : 'in honor of'} ${formData.dedication.name}` : ''}
            \nPayment Method: ${formData.paymentMethod.toUpperCase()}
            \nProof of Payment: ${formData.proofType === 'screenshot' ? 'Screenshot uploaded' : `Transaction Code: ${formData.transactionCode}`}
            ${formData.sendReceipt ? '\nA receipt will be sent to your email.' : ''}
            \n\nWe will verify your payment and contact you at ${formData.phone} if needed.`;
        
        alert(message);
        
        // Reset form and preview
        this.reset();
        imagePreview.style.display = 'none';
        imagePreview.querySelector('img').src = '';
    });

    // Add to main.js
    function generateQRCode(paymentMethod, amount) {
        // Using a QR code library like qrcode.js
        const qrData = `${paymentMethod.toUpperCase()}_PAYMENT:${amount}ZMW`;
        const qrContainer = document.getElementById('qrcode');
        new QRCode(qrContainer, qrData);
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Handle donation tiers
        const tierButtons = document.querySelectorAll('.tier-btn');
        const amountInput = document.getElementById('amount');

        tierButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tierButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                // Set amount
                amountInput.value = button.dataset.amount;
            });
        });

        // Handle recurring donation
        const recurringCheckbox = document.getElementById('recurringDonation');
        const submitButton = document.querySelector('#donationForm button[type="submit"]');

        recurringCheckbox?.addEventListener('change', function() {
            submitButton.textContent = this.checked ? 
                'Set Up Monthly Donation' : 'Submit Donation';
        });

        // Handle proof of payment type selection
        const proofTypeSelect = document.getElementById('proofType');
        const screenshotProof = document.getElementById('screenshotProof');
        const transactionProof = document.getElementById('transactionProof');

        proofTypeSelect?.addEventListener('change', function() {
            screenshotProof.style.display = 'none';
            transactionProof.style.display = 'none';
            
            if (this.value === 'screenshot') {
                screenshotProof.style.display = 'block';
            } else if (this.value === 'transaction') {
                transactionProof.style.display = 'block';
            }
        });

        // Handle image preview
        const paymentScreenshot = document.getElementById('paymentScreenshot');
        const imagePreview = document.getElementById('imagePreview');

        paymentScreenshot?.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    this.value = '';
                    return;
                }

                // Validate file type
                if (!file.type.match('image.*')) {
                    alert('Please upload an image file');
                    this.value = '';
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.style.display = 'block';
                    imagePreview.querySelector('img').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Remove image preview
        function removeImage() {
            imagePreview.style.display = 'none';
            imagePreview.querySelector('img').src = '';
            paymentScreenshot.value = '';
        }

        // Handle dedication type selection
        const dedicationType = document.getElementById('dedicationType');
        const dedicationDetails = document.getElementById('dedicationDetails');

        dedicationType?.addEventListener('change', function() {
            dedicationDetails.style.display = this.value ? 'block' : 'none';
        });
    });

    // Add to your existing JavaScript
    function updateDonationSummary() {
        const amount = document.getElementById('amount').value;
        const purpose = document.getElementById('donationPurpose').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const currency = document.getElementById('currency').value;

        if (amount && purpose && paymentMethod) {
            document.querySelector('.donation-summary').style.display = 'block';
            document.getElementById('summaryAmount').textContent = `${currency} ${amount}`;
            document.getElementById('summaryPurpose').textContent = purpose;
            document.getElementById('summaryPayment').textContent = paymentMethod.toUpperCase();
            document.getElementById('summaryTotal').textContent = `${currency} ${amount}`;
        }
    }

    // Add event listeners for real-time updates
    ['amount', 'donationPurpose', 'paymentMethod', 'currency'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateDonationSummary);
    });

    // Language Switcher
    const translations = {
        en: {
            home: "Home",
            about: "About",
            events: "Events",
            contact: "Contact",
            donation: "Donation",
            donate: "Donate Now",
            learnMore: "Learn More",
            carousel1Title: "Transforming the World Through Compassion",
            carousel1Text: "A platform where young voices drive meaningful change through creativity, advocacy, and community action"
        },
        ny: {
            home: "Kunyumba",
            about: "Za Ife",
            events: "Zochitika",
            contact: "Lumikizana",
            donation: "Kupereka",
            donate: "Pereka Tsopano",
            learnMore: "Dziwa Zambiri",
            carousel1Title: "Kusintha Dziko Kudzera mu Chifundo",
            carousel1Text: "Malo omwe mawu a achinyamata amabweretsa kusintha kwaphindu kudzera mu luso, kulimbikitsa ndi ntchito za m'deralo"
        },
        be: {
            home: "Kung'anda",
            about: "Pali Ifwe",
            events: "Ifilecitika",
            contact: "Twampane",
            donation: "Ukupela",
            donate: "Pela Nomba",
            learnMore: "Sambilila Nafifye",
            carousel1Title: "Ukupilibula Icalo Ukupitila mu Luse",
            carousel1Text: "Incende apo amashiwi ya balumendo baleleta ukupilibuka ukwawama ukupitila mu bucenjeshi, ukulimbikisha elyo ne milimo ya muncende"
        }
    };

    document.querySelectorAll('[data-lang]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            changeLanguage(lang);
        });
    });

    function changeLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.dataset.translate;
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update active language
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });
        
        localStorage.setItem('preferredLanguage', lang);
    }

    // Add this to initialize the language from localStorage
    document.addEventListener('DOMContentLoaded', () => {
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        changeLanguage(savedLang);
    });

})(jQuery);

