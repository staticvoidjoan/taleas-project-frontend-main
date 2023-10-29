import React from "react"
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import Unicorn from "../assets/images/Unicorn.png";
import Card from "../components/cards/cards"

test("Should render card component", () =>{
    render(<Card title={"TestTitle"} info={"Test Info"} category={"Category Test"} background={Unicorn}/>)
    const cardElement = screen.getByTestId("card-test")
    expect(cardElement).toBeInTheDocument();
})