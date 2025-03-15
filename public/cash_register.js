$(document).ready(function() {
    // Translations
    const translations = {
        en: {
            title: "Cash Register",
            subtitle: "End-of-Day Cash Management",
            language: "Language:",
            registerContents: "Current Register Contents",
            pennies: "Pennies",
            nickels: "Nickels",
            dimes: "Dimes",
            quarters: "Quarters",
            halfDollars: "Half Dollars",
            dollars: "Dollars",
            fiveDollars: "Five Dollars",
            tenDollars: "Ten Dollars",
            twentyDollars: "Twenty Dollars",
            totalInRegister: "Total in Register:",
            endOfDaySettings: "End of Day Settings",
            holdoverAmount: "Holdover Amount:",
            holdoverTooltip: "Amount to be kept in the register for the next day",
            reset: "Reset",
            calculateEndDay: "Calculate End Day",
            cashToRemove: "Cash to Remove",
            amountToRemove: "Amount to Remove:",
            denominationsToRemove: "Denominations to Remove:",
            print: "Print",
            newCalculation: "New Calculation",
            penny: "Penny",
            nickel: "Nickel",
            dime: "Dime",
            quarter: "Quarter",
            halfDollar: "Half Dollar",
            dollar: "Dollar",
            noCoinsToRemove: "No coins need to be removed."
        },
        es: {
            title: "Caja Registradora",
            subtitle: "Gestión de Efectivo al Final del Día",
            language: "Idioma:",
            registerContents: "Contenido Actual de la Caja",
            pennies: "Centavos",
            nickels: "Cinco Centavos",
            dimes: "Diez Centavos",
            quarters: "Veinticinco Centavos",
            halfDollars: "Cincuenta Centavos",
            dollars: "Dólares",
            fiveDollars: "Cinco Dólares",
            tenDollars: "Diez Dólares",
            twentyDollars: "Veinte Dólares",
            totalInRegister: "Total en Caja:",
            endOfDaySettings: "Configuración de Cierre",
            holdoverAmount: "Cantidad a Mantener:",
            holdoverTooltip: "Cantidad que debe mantenerse en la caja para el día siguiente",
            reset: "Reiniciar",
            calculateEndDay: "Calcular Cierre",
            cashToRemove: "Efectivo para Retirar",
            amountToRemove: "Cantidad a Retirar:",
            denominationsToRemove: "Denominaciones a Retirar:",
            print: "Imprimir",
            newCalculation: "Nuevo Cálculo",
            penny: "Centavo",
            nickel: "Cinco Centavos",
            dime: "Diez Centavos",
            quarter: "Veinticinco Centavos",
            halfDollar: "Cincuenta Centavos",
            dollar: "Dólar",
            noCoinsToRemove: "No hay monedas para retirar."
        }
    };
    
    // Load saved language preference or default to English
    let currentLang = localStorage.getItem('cashRegisterLanguage') || 'en';
    $('#languageSelect').val(currentLang);
    
    // Apply translations on page load
    applyTranslations(currentLang);
    
    // Handle language change
    $('#languageSelect').change(function() {
        currentLang = $(this).val();
        localStorage.setItem('cashRegisterLanguage', currentLang);
        applyTranslations(currentLang);
    });
    
    // Apply translations based on language code
    function applyTranslations(lang) {
        $('[data-i18n]').each(function() {
            const key = $(this).attr('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                $(this).text(translations[lang][key]);
            }
        });
    }
    // Input field focus styling
    $('input').focus(function() {
        $(this).closest('.coin-input').addClass('active');
    }).blur(function() {
        $(this).closest('.coin-input').removeClass('active');
    });
    
    // Increment and decrement buttons
    $('.increment').click(function() {
        const targetId = $(this).data('target');
        const input = $('#' + targetId);
        input.val(Math.max(0, parseInt(input.val()) + 1));
        updateTotal();
    });
    
    $('.decrement').click(function() {
        const targetId = $(this).data('target');
        const input = $('#' + targetId);
        input.val(Math.max(0, parseInt(input.val()) - 1));
        updateTotal();
    });
    
    // Update total when any input changes
    $('input').on('input', function() {
        updateTotal();
    });
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + (amount / 100).toFixed(2);
    }
    
    // Update total amount
    function updateTotal() {
        let total = 0;
        
        total += parseInt($('#c1').val() || 0) * 1;
        total += parseInt($('#c5').val() || 0) * 5;
        total += parseInt($('#c10').val() || 0) * 10;
        total += parseInt($('#c25').val() || 0) * 25;
        total += parseInt($('#c50').val() || 0) * 50;
        total += parseInt($('#c100').val() || 0) * 100;
        total += parseInt($('#c500').val() || 0) * 500;
        total += parseInt($('#c1000').val() || 0) * 1000;
        total += parseInt($('#c2000').val() || 0) * 2000;
        
        $('#totalAmount').text(formatCurrency(total));
    }
    
    // Reset button
    $('#reset').click(function() {
        $('input[type="number"]').val(0);
        updateTotal();
        $('#errorMessage').hide();
    });
    
    // Format denomination names
    function formatDenomination(value) {
        const lang = $('#languageSelect').val();
        
        switch(parseInt(value)) {
            case 1: 
                return lang === 'en' ? "1¢ (Penny)" : "1¢ (Centavo)";
            case 5: 
                return lang === 'en' ? "5¢ (Nickel)" : "5¢ (Cinco Centavos)";
            case 10: 
                return lang === 'en' ? "10¢ (Dime)" : "10¢ (Diez Centavos)";
            case 25: 
                return lang === 'en' ? "25¢ (Quarter)" : "25¢ (Veinticinco Centavos)";
            case 50: 
                return lang === 'en' ? "50¢ (Half Dollar)" : "50¢ (Cincuenta Centavos)";
            case 100: 
                return lang === 'en' ? "$1" : "$1 (Un Dólar)";
            case 500: 
                return lang === 'en' ? "$5" : "$5 (Cinco Dólares)";
            case 1000: 
                return lang === 'en' ? "$10" : "$10 (Diez Dólares)";
            case 2000: 
                return lang === 'en' ? "$20" : "$20 (Veinte Dólares)";
            default: 
                return value + "¢";
        }
    }
    
    // Calculate button
    $('#calculate').click(function() {
        $('#errorMessage').hide();
        $('#loadingSpinner').show();
        
        let coins = {
            1: parseInt($('#c1').val() || 0),
            5: parseInt($('#c5').val() || 0),
            10: parseInt($('#c10').val() || 0),
            25: parseInt($('#c25').val() || 0),
            50: parseInt($('#c50').val() || 0),
            100: parseInt($('#c100').val() || 0),
            500: parseInt($('#c500').val() || 0),
            1000: parseInt($('#c1000').val() || 0),
            2000: parseInt($('#c2000').val() || 0)
        };
        
        let holdover = parseInt($('#holdover').val() || 0) * 100; // Convert to cents
        
        // Calculate total for summary
        let total = 0;
        for (const [value, quantity] of Object.entries(coins)) {
            total += value * quantity;
        }
        
        $('#summaryTotal').text(formatCurrency(total));
        $('#summaryHoldover').text(formatCurrency(holdover));
        $('#summaryRemove').text(formatCurrency(total - holdover));
        
        $.ajax({
            url: '/end-day',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ coins: coins, holdover: holdover }),
            success: function(response) {
                $('#loadingSpinner').hide();
                
                // Clear previous results
                $('#result').empty();
                
                if (Object.keys(response).length === 0) {
                    const noCoinsMessage = currentLang === 'en' ? 
                        translations.en.noCoinsToRemove : 
                        translations.es.noCoinsToRemove;
                    $('#result').html(`<div class="alert alert-info"><i class="fas fa-info-circle"></i> ${noCoinsMessage}</div>`);
                } else {
                    // Sort denominations from highest to lowest
                    const sortedDenominations = Object.keys(response).sort((a, b) => parseInt(b) - parseInt(a));
                    
                    // Add results
                    for (const denomination of sortedDenominations) {
                        const quantity = response[denomination];
                        $('#result').append(`
                            <div class="result-item">
                                <span class="coin-name">${formatDenomination(denomination)}</span>
                                <span class="coin-count">${quantity}</span>
                            </div>
                        `);
                    }
                }
                
                // Show results card
                $('.results-card').show();
            },
            error: function(xhr) {
                $('#loadingSpinner').hide();
                
                let errorMessage = "Error processing request";
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.error || errorMessage;
                } catch (e) {}
                
                $('#errorText').text(errorMessage);
                $('#errorMessage').show();
            }
        });
    });
    
    // Print results
    $('#printResults').click(function() {
        window.print();
    });
    
    // New calculation button
    $('#newCalculation').click(function() {
        $('.results-card').hide();
    });
    
    // Initialize
    updateTotal();
});