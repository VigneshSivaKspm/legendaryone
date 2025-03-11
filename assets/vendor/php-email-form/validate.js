document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS with your public key
    emailjs.init("q81noyaD3sW8o6jdU"); // Replace with your actual public key

    const contactForm = document.getElementById("contactForm");
    const responseMessage = document.getElementById("response-message");
    const sendingMessage = document.getElementById("sending");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Show the "Sending..." message
        sendingMessage.style.display = "block";
        responseMessage.style.display = "none";

        // Collect form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const contactNumber = document.getElementById("number").value;

        // Prepare template parameters
        const templateParams = {
            name: name,
            email: email,
            message: message,
            number: contactNumber,
        };

        // Send email using EmailJS
        emailjs
            .send("service_hcuvta5", "template_s0i4ptm", templateParams)
            .then(
                function (response) {
                    console.log("SUCCESS!", response.status, response.text);
                    sendingMessage.style.display = "none";
                    responseMessage.innerText = "Message sent successfully!";
                    responseMessage.style.color = "green";
                    responseMessage.style.display = "block";
                    contactForm.reset();
                },
                function (error) {
                    console.error("FAILED...", error);
                    sendingMessage.style.display = "none";
                    responseMessage.innerText = "Failed to send the message. Please try again.";
                    responseMessage.style.color = "red";
                    responseMessage.style.display = "block";
                }
            );
    });
});