import React, { useEffect, useState } from "react";
import "./App.css";
import "./AllCSS/Item.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AllCSS/submit.css";

function App() {
  const [showItem, setShowItem] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [cities, setCities] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState();
  const [UnitPrice, SetUnitPrice] = useState();
  const [supplierName, setSupplierName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setcity] = useState();
  const [mobileno, setMobileno] = useState();
  const [isValid, setIsValid] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");

  const handlechangeDate = (date) => {
    setSelectedDate(date);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^]s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    async function fetchCountryList() {
      try {
        const response = await fetch(
          "https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-CountryList"
        );
        const data = await response.json();
        setCountries(data.data.countyList);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchStateList(selectedCountry);
    }
  }, [selectedCountry]);

  async function fetchStateList(id) {
    if (!id) {
      setStates([]);
      return;
    }
    try {
      const response = await fetch(
        `https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-SateList-By-Country?countryId=${id}`
      );
      const data = await response.json();
      console.log(data);
      setStates(data.data.stateList);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchCityList(selectedCountry, selectedState);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  async function fetchCityList(Countryid, stateid) {
    if (!Countryid || !stateid) {
      setCities([]);
      return;
    }
    try {
      const response = await fetch(
        `https://apis-technical-test.conqt.com/Api/countrystatecity/Get-All-CityList-By-Country-State?countryId=${Countryid}&stateId=${stateid}`
      );
      const data = await response.json();
      console.log(data);
      setCities(data.data.cityList);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async () => {
    if (validateEmail(email)) {
      console.log("Invalid Email");
      setSubmitMessage("Invalid Mail");
    }
    const PostData = {
      itemDetails: {
        itemName: itemName,
        quantity: quantity,
        unitPrice: UnitPrice,
        currency: "$",
        submissionDate: selectedDate,
      },
      supplier: {
        supplierName: supplierName,
        companyName: companyName,
        email: email,
        phoneNumber: mobileno,
        countryId: selectedCountry,
        stateId: selectedState,
        cityId: city,
      },
    };
    try {
      const response = await fetch(
        "https://apis-technical-test.conqt.com/Api/Item-Supplier/Save-Items-Suppliers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(PostData),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* navbar */}
      <div className="Container">
        <div className="Heading">
          <div className="Main-Image"> </div>
          <h1>Inventory Management System</h1>
        </div>
        <div>
          <h5>Home</h5>
        </div>
      </div>

      {/* checkboxes */}
      <div className="checkboxes-container">
        <label className="Checkbox-head">
          <input
            type="checkbox"
            checked={showItem}
            onChange={() => setShowItem(!showItem)}
          />
          <span>Item</span>
        </label>

        <label className="Checkbox-head">
          <input
            type="checkbox"
            checked={showSupplier}
            onChange={() => setShowSupplier(!showSupplier)}
          />
          <span>Supplier</span>
        </label>
      </div>

      {/* show */}
      <div className="Show-container">
        {/* Item */}
        {showItem && (
          <div className="Item-Container">
            <div className="Item-Heading">
              <h1>Item Details</h1>
            </div>
            <div className="item-details">
              <div className="Container-item">
                <div className="Items">
                  <label> Item Name</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.vale)}
                    placeholder="Enter item name"
                  />
                  <small>Max 50 characters</small>
                </div>

                <div className="Items">
                  <label> Quantity</label>
                  <input
                    type="Number"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                    placeholder="Enter Quantity"
                  />
                  <small>Numberic value</small>
                </div>

                <div className="Items">
                  <label> Unit Price</label>
                  <input
                    type="Number"
                    onChange={(e) => SetUnitPrice(e.target.value)}
                    value={UnitPrice}
                    placeholder="Enter Unit Price"
                  />
                  <small>Numeric value (USD)</small>
                </div>

                <div className="Items">
                  <label>Date of Selection</label>
                  <DatePicker
                    id="datepicker"
                    selected={selectedDate}
                    onChange={handlechangeDate}
                    minDate={new Date()}
                    placeholderText="MM/DD/YYYY"
                    dateFormat="MM/dd/yyyy"
                  />
                  <small>Format MM/DD/YY</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supplier */}
        {showSupplier && (
          <div className="Item-Container">
            <div className="Item-Heading">
              <h1>Supplier Details</h1>
            </div>
            <div className="item-details">
              <div className="Container-item">
                <div className="Items">
                  <label> Supplier Name</label>
                  <input
                    type="text"
                    placeholder="Enter supplier name"
                    onChange={(e) => setSupplierName(e.target.value)}
                    value={supplierName}
                  />
                  <small>Max 50 character</small>
                </div>

                <div className="Items">
                  <label> Company Name</label>
                  <input
                    type="Text"
                    placeholder="Enter company name"
                    onChange={(e) => setCompanyName(e.target.value)}
                    value={companyName}
                  />
                  <small>Max 50 character</small>
                </div>

                <div className="Items">
                  <label> Country</label>
                  <select
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    value={selectedCountry}
                  >
                    {countries.map((country) => (
                      <option key={country.countryId} value={country.countryId}>
                        {country.name};
                      </option>
                    ))}
                  </select>
                  <small>Select country from the list</small>
                </div>

                <div className="Items">
                  <label>State</label>
                  <select
                    onChange={(e) => setSelectedState(e.target.value)}
                    value={selectedState}
                  >
                    {states.map((state) => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.name};
                      </option>
                    ))}
                  </select>
                  <small>Select state from the list</small>
                </div>

                <div className="Items">
                  <label>City</label>
                  <select
                    onChange={(e) => setcity(e.target.value)}
                    value={city}
                  >
                    {cities.map((country) => (
                      <option key={country.cityId} value={country.cityId}>
                        {country.name};
                      </option>
                    ))}
                  </select>
                  <small>Max 50 characters</small>
                </div>

                <div className="Items">
                  <label>Email Address</label>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  <small>valid email format</small>
                </div>

                <div className="Items">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    placeholder="Enter email address"
                    onChange={(e) => setMobileno(e.target.value)}
                    value={mobileno}
                  />
                  <small>Valid mobile Number</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      {showItem && showSupplier && (
        <div className="Submit-Container">
          <div className="inner-container">
            <h1 className="submit-heading">Submitted Data</h1>
            <h5>The data submitted by users will be displayed below</h5>
            <button onClick={handleSubmit}>Save Changes</button>
          </div>
          {submitMessage && { submitMessage }}
        </div>
      )}
    </div>
  );
}

export default App;
