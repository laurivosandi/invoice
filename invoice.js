window.l10n = {
    "et": {
        "Invoice to": "Maksja",
        "From": "Müüja",
        "Item name": "Toote nimetus",
        "Quantity": "Hulk",
        "Unit price": "Ühiku hind",
        "Amount": "Hind",
        "Invoice number": "Arve number",
        "Invoice date": "Arve kuupäev",
        "Due date": "Makse tähtaeg",
        "Amount due": "Tasumisele kuulub",
        "VATIN": "KMKR",
        "Bank name": "Panga nimi",
        "Bank address": "Panga aadress",
    }
}

function parseHash() {
    var params = (window.location.hash.substr(1)).split("&");

    for (i = 0; i < params.length; i++) {
        var bits = params[i].split("=");
        localStorage.setItem(bits[0], bits[1]);
    }
    
    var keys = "from_eori from_iban from_swiftbic language currency".split();
    
    for (var j = 0; j < keys.length; j++) {
        var value = localStorage.getItem(keys[j]);
        if (value) {
            $("#from_" + keys[j] + " input").val(value);
        }
    }
    
}

function recalc() {
    $rows = $("#list tr");
    
    var subtotal = 0.0;
    for (var j = 0; j < $rows.length; j++) {
        if (j == 0) {
            continue; // Skip header
        }
        var quantity = $(".quantity input", $rows[j]).val();
        var price = parseFloat($(".price input", $rows[j]).val());
        var amount = quantity * price;
        $(".amount .value", $rows[j]).html(amount.toFixed(2));
        
        subtotal += amount;
    }
    $("#subtotal_value").html(subtotal.toFixed(2));
    


    var vat_percent = parseInt($("#vat_percent").val());
    var vat = vat_percent * subtotal / 100.0;
    var total = vat + subtotal;
    console.log("vat percent:", vat_percent, "vat:", vat, "total:", total);
    $("#vat_value").html(vat.toFixed(2));
    $("#amount_due").html(total.toFixed(2));
    

    
    
}

function lz(n) {
    if (n < 10) return "0" + n;
    return "" + n;
}

function onChangeFromVATIN() {
    var vat_number = $("#from_vatin input").val();
    
    var vat_visible = !(vat_number == "-" || vat_number == "");
    var vat_calculation_visiblity = vat_visible ? "visible" : "hidden";
    
    if (vat_visible) {
        console.info("Showing VAT");
        $("#from_vatin").removeClass("print-display-none");
        $("#vat_percent").val("20");
    } else {
        console.info("Hiding VAT");
        $("#from_vatin").addClass("print-display-none");
        $("#vat_percent").val("0");
    }

    
    
    $("#vat_label").css("visibility", vat_calculation_visiblity);
    $("#vat").css("visibility", vat_calculation_visiblity);
    
    $("#subtotal_label").css("visibility", vat_calculation_visiblity);
    $("#subtotal").css("visibility", vat_calculation_visiblity);

    recalc();
}

function hideEmptyFields() {
    var value = $(this).val();
        
    if (value == "-" || value == "") {
        $(this).addClass("print-display-none");
    } else {
        $(this).removeClass("print-display-none");
    }
}

$(document).ready(function(e) {
    parseHash();
/*
    $("#list .product input").on("change", function() {
        var $row = $(this).parents("tr");

        
        if ($(this).val() == "") {
            console.log("Hiding");
            $(".quantity input", $row).hide();
            $(".price input", $row).hide();
            $(".amount", $row).html("");
        } else {
            console.log("Showing");
            $(".quantity input", $row).show();
            $(".price input", $row).show();
            $(".amount input", $row).show();
        }

        
    });*/


    $("input.print-display-none").each(function() {
        if ($(this).val() != "") {
            $(this).removeClass("print-display-none");
            if (!$(this).attr("placeholder")) {
                $(this).attr("placeholder", $(this).val());
            }
        }
    })
        
    $("input.print-display-none").on("change", hideEmptyFields);

        
    $("#list .quantity input").on("change", recalc);
    $("#list .price input").on("change", recalc);
    $("#vat_percent").on("change", recalc);
    
    $("#from_vatin input").on("change", onChangeFromVATIN);

    
    onChangeFromVATIN();


    var now = new Date();
    $("#invoice_number").val(1900+now.getYear() + lz(now.getMonth()+1) + lz(now.getDate()) + "001");
    $("#invoice_date").val(now.toLocaleDateString("et-EE"));
    
    
    /* Prepare */
    $(".translate").each(function() {
        $(this).attr("data-source-string", $(this).html());
    });
    
    $("#language").on("change", function(e) {
        var language = $("#language").val();
        
        $nodes = $(".translate");
        
        $nodes.each(function($n) {
            var $node = $(this);
            if (language == "en") {
                
            } else {
                var orig = $node.attr("data-source-string");
                var appendColon = false;
                if (orig.lastIndexOf(":") == orig.length-1) {
                    appendColon = true;
                    orig = orig.substring(0, orig.length-1);
                }
                
                
                var substitute =  window.l10n[language][orig];
                if (substitute) {
                
                    console.log("Translating", orig, "to", substitute);

                    $node.html(substitute + (appendColon ? ":" : ""));
                } else {
                    console.log("No translation found for", orig, "in language", language);

                }
            }
        });
    });
    
    
    $("#currency").on("change", function(e) {
        console.log($(".currency").get());
        $(".currency").html($("#currency").val());
        

    });
});
