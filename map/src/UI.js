import { Component } from "react";
import './UI.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const key = "AIzaSyD0Ba3ZhficPIKgJJH4UFASeGn4KZ_EgVw";
const proxyurl = "https://corsanywhere.herokuapp.com/";
const BaseURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

class DataInfo{
    constructor(origin, destination, mode = "DRIVING"){
        this.inputs = {
            origin: origin,
            destination: destination,
            mode: mode
        }
        this.distance = 0;
        this.time = 0;
    }
    set_distance(distance){
        this.distance = distance;
    }
    set_time(time){
        this.time = time;
    }
    get_distance(){
        return this.distance;
    }
    get_time(){
        return this.time;
    }
} 

class Interface extends Component{
    constructor(props){
        super(props);
        this.state = {
            origin:"" ,
            destination: "",
            distance: -1,
            time: -1,
            errorMsg: "",
            msg1: "",
            msg2: ""
        };
    }
    update = (dis, tim, err) =>{
        //console.log(err);
        let message1 = "";
        let message2 = "";
        if (err === "") {
            message1 = "The distance between two addresses is: " +  (dis/1000).toFixed(2) + " km.";
            message2 = "You will take " + (tim/60).toFixed(2) + " minutes.";
        }
        this.setState(
            {
                ...this.state,
                distance: dis,
                time: tim,
                msg1: message1,
                msg2: message2,
                errorMsg: err
            }
        )
    }
    init = () =>{
        this.setState(
            {
                ...this.state,
                errMsg: ""
            }
        )
    }
    handleChange = () =>{
        let origin = document.getElementById("oriInput").value;
        let destination = document.getElementById("dstInput").value;
        let mode = document.getElementById("transitMode").value.toLowerCase();
        
        //Test Case 1
        // origin = '153 Bank St, Ottawa, ON K1P 5N7';
        // destination = '100 Louis-Pasteur Private, Ottawa, ON K1N 9N3';
        // mode = 'DRIVING';

        //Test Case 2
        // origin = '153 Bank St, Ottawa, ON K1P 5N7';
        // destination = '100 Louis-Pasteur Private, Ottawa, ON K1N 9N3';
        // mode = 'Walking';


        //Test Case 3
        // origin = '153 Bank St, Ottawa, ON K1P 5N7';
        // destination = '100 Louis-Pasteur Private, Ottawa, ON K1N 9N3';
        // mode = 'Transit';


        //Test Case 4
        // origin = '153 Bank St, Ott';
        // destination = '100 Louis-Pasteur Private';
        // mode = 'DRIVING';


        //Test Case 5
        // origin = '';
        // destination = '';
        // mode = 'DRIVING';


        //Test Case 6
        // origin = '1jajaepfjpaef';
        // destination = '100 Louis-Pasteur Private';
        // mode = 'DRIVING';


        //console.log(origin);
        //console.log(destination);
        //console.log(mode);
        let info = new DataInfo(origin, destination, mode);
        this.DisMatrixAPI(info);
    }

    DisMatrixAPI(DataInfoObj) {
        let errMsg = "";
        let origin = escape(DataInfoObj.inputs.origin);
        let destination = escape(DataInfoObj.inputs.destination);
        let mode =  'mode=' + DataInfoObj.inputs.mode;
        origin = 'origins=' + origin;
        destination = 'destinations=' + destination;
        let url = BaseURL + origin + "&" + destination + "&" + mode + "&units=imperial&"
        url = proxyurl + url + "key=" + key;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.responseType = "text";
        xhr.send();
        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                let jsonResult = JSON.parse(xhr.responseText);
                //console.log(xhr.responseText);
                if (jsonResult.status === "OK"){
                    const data = jsonResult.rows[0].elements[0];
                    if (data.status === "OK") {
                        this.update(data.distance.value, data.duration.value, "");
                        return;
                    }else if (data.status === "ZERO_RESULTS") {
                        errMsg = "Please provide more details for your inputs (Try adding Province and/or Postal Code)";
                        this.update("","",errMsg);
                        return;
                    }else{
                        console.log("Invalid");
                        errMsg = "Your Addresses is invalid. API Response: " + data.status;
                        this.update("","",errMsg);
                        return;
                    }
                }else{
                    errMsg = "Emputy or Invalid Input: Cannot parse result to the json format.";
                    this.update("","",errMsg);
                    return;
                }
            }else{
                errMsg = "Request URL failed. Status Code: " + xhr.status;
                this.update("","",errMsg);
                return;
            }
        };
    }
    render(){
        return(
            <div className="container inputPlace">
                <form className="form1">
                    <label htmlFor="oriInput" className="label1">Please enter your origin address:</label>
                    <input type="text" className="form-control input-group-sm" placeholder="Origin Address" id="oriInput"></input>
                </form>
                <form className="form2">
                    <label htmlFor="dstInput" className="label2">Please enter your destination address:</label>
                    <input type="text" className="form-control input-group-sm" placeholder="Destination Address" id="dstInput"></input>
                </form>
                <form className="form3">
                    <label htmlFor="transitMode" className="form-label">Please choose your way to go:</label>
                    <select className="form-select" id="transitMode">
                        <option>Driving</option>
                        <option>Walking</option>
                        <option>Transit</option>
                    </select>
                </form>
                <button type="button" className="btn btn-primary" onClick={this.handleChange}>Search</button>
                <h5 id="distanceResult">{this.state.msg1}</h5>
                <h5 id="timeResult">{this.state.msg2}</h5>
                <h5 id="errorMessage">{this.state.errorMsg}</h5>
            </div>
        )
    }
}
export default Interface;