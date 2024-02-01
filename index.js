const express = require("express");
const app = express();
const stripe = require("stripe")(
    "sk_test_51OLbP5K5xGPGY8BfvKxvKc0PWPjaj7oPiYVrFbJRF2irsWfPxJMTKY8PLmB9DICHuukIW0ldBSipMeLlTbCQASPy00BNKLDbIa"
);


app.use(express.static("public"));
app.use(express.json());


function calculateTotalAmount(products) {
    // Ensure products is an array
    if (!Array.isArray(products)) {
        throw new Error('Products should be an array.');
    }

    // Calculate the total amount
    const totalAmount = products.reduce((total, product) => {
        // Ensure the necessary properties exist on each product
        if (
            typeof product.quantity === 'number' &&
            typeof product.price === 'string' &&
            !isNaN(product.quantity) &&
            !isNaN(parseFloat(product.price))
        ) {
            total += product.quantity * parseFloat(product.price);
        } else {
            console.error('Invalid product data:', product);
        }

        return total;
    }, 0);

    return totalAmount * 100; // Return the total amount as a number
}



app.post("/create-payment-intent", async (req, res) => {

    const items = req.body;
    console.log(items);
    console.log(calculateTotalAmount(items))



    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateTotalAmount(items),
        currency: "chf"
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    })
});


app.listen(8080, () => console.log("Server is listening on port 8080"));
