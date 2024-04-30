const dotenv = require("dotenv");
dotenv.config();
const assert = require("assert");
const { StatusCodes } = require("http-status-codes");
const sinon = require("sinon");
const orderService = require("../src/services/service.customer");
const { pagination } = require("../src/controllers/controller.customer");

/**
 * Test definitions
 *
 * Mock: A mock is an object that mimics the behavior of a real object or system.
 * It allows you to simulate the behavior of real objects in a controlled way
 * and is often used in testing to replace real dependencies with predictable
 * behavior for testing purposes.
 *
 * Stub: A stub is a function or object that replaces a real component or dependency in a test.
 * It allows you to control the behavior of the replaced component and define specific return values
 * or actions to be taken when the replaced function or method is called.
 * Stubs are commonly used in testing to isolate the code under test from its dependencies and
 * to create predictable test scenarios.
 *
 * Spies: A spy is a function or object that records information about function calls made during the test.
 * It allows you to monitor how functions are used, including how many times they are called, with which
 * arguments, and what values they return. Spies are useful for verifying that certain functions are
 * called or for inspecting the behavior of functions in the code under test.
 */

describe("Order Controllers", () => {
  describe("pagination", () => {
    it("should return a pagination order", async () => {
      const req = {
        query: {
          page: 1,
          limit: 10,
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      // Mocking the behavior of the userService.pagination function for testing purposes
      const fakeOrder = [{
        order_id: 1,
        customer_id: 1,
        order_date: "012024-04-29 01:00:00",
      }];


      // Creating a stub to replace the userService.pagination function during testing
      const signupStub = sinon.stub(orderService, "pagination").resolves(fakeOrder);

      // Call the function under test
      await pagination(req, res);

      // Assert the behavior
      assert(res.status.calledOnceWith(StatusCodes.OK));
      assert(res.json.calledOnceWith(fakeOrder));

      // Restore the original function to avoid affecting other tests
      signupStub.restore();
    });
  });

 

});
