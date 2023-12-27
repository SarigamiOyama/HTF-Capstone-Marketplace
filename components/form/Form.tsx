import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useState } from "react";

export const Form =( ) => {
    const elements = useElements();
    const stripe = useStripe();


    const [ isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] =useState(false);
    const [message, setMessage] =useState("");

    const onClick = async () => {
        if(!stripe || !elements ) {
            return;
        }

        setIsLoading(true);


        try {
            const { paymentIntent, error} =await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: "http://localhost:3000",

                },
                redirect: "if_required"
            });
            if(error) {
                throw error.message;
            }
            if(paymentIntent.status === "succeeded") {
                setMessage("Payment complete! Please wait as you recieve  your NFT shortly")
                setIsCompleted(true);

            } else {
                alert("PAYMENT FAILED")
            }

        }catch (error) {
            alert ("There was an Error");
        }

        setIsLoading(false);
    }




    return (
        <>
            {!isCompleted ? (

                 <>
                    <PaymentElement/>
                    <button
                            style={{
                                padding: "1rem",
                                marginTop: "1rem",
                                borderRadius: "10px",
                                border: "none",
                                backgroundColor:"white",
                                color: "black",
                                cursor: "pointer",
                                width: "100%",
                            }}
                            disabled={isLoading || isCompleted || !stripe || !elements}
                             onClick={onClick}
                    >
                            {isCompleted 
                                ? "Payment recieved"
                                : isLoading
                                ? "Please wait ..."
                                : "Pay Now"
                            }
                    </button>
        </>
    ) : (
        <p> {message}</p>
    )}

    </>
    )
}