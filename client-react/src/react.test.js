import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { UserContext } from "../src/context/UserContext";
import Header from "../src/components/Header";

//render the header with UserContext
describe("Create Post Button in Header", () => {
  const renderHeaderWithContext = (authUser) => {
    render(
      <UserContext.Provider value={{ authUser, setAuthUser:jest.fn()}}>
        <Header />
      </UserContext.Provider>
    );};

  test("button Create Post is disabled for guest users", () => {
    renderHeaderWithContext(null); //null user
    const createPostButton = screen.getByRole("button", { name: /create post/i });
    expect(createPostButton).toHaveAttribute("disabled"); //accert
  });

  test("button Create Post is enabled for logged-in users", () => {
    const mockUser = { id: "123", displayName: "TestUser" };//test user
    renderHeaderWithContext(mockUser);

    const createPostButton = screen.getByRole("button", { name: /create post/i });
    expect(createPostButton).not.toHaveAttribute("disabled");//accert
  });
});
