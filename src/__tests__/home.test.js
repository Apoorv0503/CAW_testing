import Home from "../components/Home";
import { fireEvent, render, screen } from "@testing-library/react";
import {userMock, DummyUserId} from "../mocks/UserMock";
import { act } from "react";
import userEvent from "@testing-library/user-event";

import { Card, CardContent, CardHeader, CardTitle } from "../utils/helper";
import { Button } from "../utils/helper";
import { Input } from "../utils/helper";
import { AlertCircle, CheckCircle } from "lucide-react";
// import { act } from "react-dom/test-utils";


describe("user dashboard tests",()=>{
    it("Verification of user fields over home component",async()=>{

        //for better state updation used act fucntion here
        await act(async()=>{
            const wrapper=await render(
                <Home userId={DummyUserId}/>
            );
            console.log(wrapper.debug());
        });
        
       
        console.log(userMock);

        //querying 
        const heading=screen.findByTestId("main_heading");
        const name=screen.findByText(`Name:${userMock.name}`);
        const email=screen.findByText(`Current Email:${userMock.email}`);
        const submitButton=screen.findByRole("button",{name:"Update Email"});
        const inputValue= screen.findByPlaceholderText("New email address");

        //assesrtion
        expect(heading).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(inputValue).toHaveValue("john@example.com");

    });

    //for input filed functionality
    it("Check if input filed is working fine",async()=>{
       //for better state updation used act fucntion here
       await act(async()=>{
            await render(
            <Home userId={DummyUserId}/>
        );

        //setup the userEvent 
        userEvent.setup();

        //find input and trigger a type event
        const inputValue= screen.findByPlaceholderText("New email address");
        await userEvent.type(inputValue, "apoorva@gmail.com");

        //find submit button and trigger click event
        const submitButton=screen.findByRole("button",{name:"Update Email"});
        await userEvent.click(submitButton);

        //chcking if the given user is present or not
        const email=screen.findByText(/Current Email: apoorva@gmail.com/);
        expect(email).toBeInTheDocument();


    })
    });

    //for conditional rendering
    it("check if text is present after successfull updation",async()=>{

        //for better state updation used act fucntion here
       await act(async()=>{
            await render(
            <Home userId={DummyUserId}/>
        );

      
        userEvent.setup();

        //find input and trigger a type event
        const inputValue= screen.findByPlaceholderText("New email address");
        await userEvent.type(inputValue, "apoorva1@gmail.com");

       
        const submitButton=screen.findByRole("button",{name:"Update Email"});
        await userEvent.click(submitButton);

        // //chcking if the given user is present or not
        const email=screen.findByText(/Current Email: apoorva1@gmail.com/);
        
        const successText=screen.findByText(/Email updated successfully/);



    })


    });
});

