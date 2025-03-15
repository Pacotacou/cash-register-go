$(document).ready(function() {
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
        switch(parseInt(value)) {
            case 1: return "1¢ (Penny)";
            case 5: return "5¢ (Nickel)";
            case 10: return "10¢ (Dime)";
            case 25: return "25¢ (Quarter)";
            case 50: return "50¢ (Half Dollar)";
            case 100: return "$1";
            case 500: return "$5";
            case 1000: return "$10";
            case 2000: return "$20";
            default: return value + "¢";
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
                    $('#result').html('<div class="alert alert-info"><i class="fas fa-info-circle"></i> No coins need to be removed.</div>');
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