$(document).ready(function() {
    $('#calculate').click(function() {
        let coins = {
            1: parseInt($('#c1').val()),
            5: parseInt($('#c5').val()),
            10: parseInt($('#c10').val()),
            25: parseInt($('#c25').val()),
            50: parseInt($('#c50').val()),
            100: parseInt($('#c100').val()),
            500: parseInt($('#c500').val()),
            1000: parseInt($('#c1000').val()),
            2000: parseInt($('#c2000').val())
        };
        let holdover = parseInt($('#holdover').val());
        

        $.ajax({
            url: '/end-day',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ coins: coins, holdover: holdover }),
            success: function(response) {
                $('#result').empty();
                $.each(response, function(coin, quantity) {
                    $('#result').append('<li>' + coin + '¢: ' + quantity + '</li>');
                });
            },
            error: function(xhr) {
                let errorMessage = "Error processing request";
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.error || errorMessage;
                } catch (e) {}
                alert(errorMessage); // Replace with a user-friendly error display
            }
        });
    });
});
