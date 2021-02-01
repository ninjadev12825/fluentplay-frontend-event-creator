import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { Multiselect } from 'multiselect-react-dropdown';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import { createSession } from "../requests/sessions.jsx"
import { getEvents } from "../requests/events.jsx"
import { getSponsors } from "../requests/sponsors.jsx"
import TimeInputPolyfill from 'react-time-input-polyfill'

const languages = [
  {name: "English"},
  {name: "French"},
  {name: "Germany"},
  {name: "Italian"},
  {name: "Portuguese"},
  {name: "Japanese"}
];

class CreateSession extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sessionName: "",
      sessionTitle: "",
      companyName: "",
      event: {},
      files: [
        {
          file_name: "Architecture.doc",
          path: "https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
        },
        {
          file_name: "Industry.doc",
          path: "https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
        },
        {
          file_name: "Agriculture.doc",
          path: "https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
        }
      ],
      startTime: "",
      translationLanguages: [],
      translationPrice: 0,
      yourLanguage: "English",
      sponsors: [],
      sessionDate: {},
      myEvents: [],
      mySponsors: [],
    }
  }

  getEventAndSponsors() {
    getEvents().then((response) => {
      let myEvents = [];
      response.data.forEach(function(event) {
        myEvents.push({id: event.eventId, name: event.eventName});
      });
      this.setState({myEvents, event: {id: myEvents[0].id, name: myEvents[0].name}});
      getSponsors().then((response) => {
        let mySponsors = [];
        response.data.forEach(function(sponsor) {
          mySponsors.push({id: sponsor.sponsorId, name: sponsor.sponsorName});
        });
        this.setState({mySponsors});
      });
    });
  }

  componentWillMount() {
    this.getEventAndSponsors();
  }

  handleTransLanguageSelect = (selectedList) => {
    let selectedLanguages = [];

    selectedList.forEach(function(language) {
      selectedLanguages.push(language.name);
    });

    this.setState({translationLanguages: selectedLanguages, edited: true});
  }

  handleTransLanguageRemove = (selectedList) => {
    let selectedLanguages = [];

    selectedList.forEach(function(language) {
      selectedLanguages.push(language.name);
    });

    this.setState({translationLanguages: selectedLanguages, edited: true});
  }

  handleSponsorSelect = (selectedList) => {
    let { mySponsors } = this.state;
    let selectedSponsors = [];

    selectedList.forEach(function(selectedSponsor) {
      mySponsors.forEach(function(sponsor) {
        if (selectedSponsor.name === sponsor.name)
          selectedSponsors.push(sponsor);
      });
    });

    this.setState({sponsors: selectedSponsors, edited: true});
  }

  handleSponsorRemove = (selectedList) => {
    let { mySponsors } = this.state;
    let selectedSponsors = [];

    selectedList.forEach(function(selectedSponsor) {
      mySponsors.forEach(function(sponsor) {
        if (selectedSponsor.name === sponsor.name)
          selectedSponsors.push(sponsor);
      });
    });

    this.setState({sponsors: selectedSponsors, edited: true});
  }
  
  handleNameChange = (eve) => {
    this.setState({sessionName: eve.target.value, edited: true});
  }
  
  handleCompanyNameChange = (eve) => {
    this.setState({companyName: eve.target.value, edited: true});
  }
  
  handleEventChange = (eve) => {
    let { myEvents } = this.state;
    
    myEvents.forEach((event) => {
      if (event.name === eve.target.value) {
        this.setState({event: {id: event.id, name: event.name}});
      }
    });
  }
  
  handleYourLanguageChange = (eve) => {
    this.setState({yourLanguage: eve.target.value, edited: true});
  }
  
  handleTitleChange = (eve) => {
    this.setState({sessionTitle: eve.target.value, edited: true});
  }
  
  handleDayChange = (day) => {
    let { sessionDate } = this.state;
    const date = moment(day).format("YYYY-MM-DD");
    const fromHours = moment(sessionDate.from).hours();
    const fromMinutes = moment(sessionDate.from).minutes();
    const ToHours = moment(sessionDate.to).hours();
    const ToMinutes = moment(sessionDate.to).minutes();

    sessionDate.from = moment(date).set({hour: fromHours, minute: fromMinutes}).format();
    sessionDate.to = moment(date).set({hour: ToHours, minute: ToMinutes}).format();

    this.setState({sessionDate, edited: true});
  }

  handleFromTimeChange = (time) => {
    let { sessionDate } = this.state;
    sessionDate.from = moment(sessionDate.from).set({ hour: parseInt(time.value.split(':')[0]), minute: parseInt(time.value.split(':')[1]) }).format();
    
    this.setState({sessionDate, edited: true});
  }
  
  handleToTimeChange = (time) => {
    let { sessionDate } = this.state;
    sessionDate.to = moment(sessionDate.to).set({ hour: parseInt(time.value.split(':')[0]), minute: parseInt(time.value.split(':')[1]) }).format();
    
    this.setState({sessionDate, edited: true});
  }

  handleTranslationPriceChange = (eve) => {
    this.setState({translationPrice: parseInt(eve.target.value), edited: true});
  }

  handleFileRemove = (eve, idx) => {
    let { temp_info } = this.state;
    let files = [];

    temp_info.files.forEach(function(file) {
      files.push(file);
    });

    files.splice(idx, 1);
    temp_info.files = files;

    this.setState({temp_info, edited: true});
  }

  handleCreate = () => {
    const {
      sessionName,
      sessionTitle,
      companyName,
      event,
      files,
      startTime,
      translationLanguages,
      translationPrice,
      yourLanguage,
      sponsors,
      sessionDate
    } = this.state;

    console.log({
      sessionName: sessionName,
      sessionTitle: sessionTitle,
      companyName: companyName,
      event: event,
      files: files,
      startTime: startTime,
      translationLanguages: translationLanguages,
      translationPrice: translationPrice,
      yourLanguage: yourLanguage,
      sponsors: sponsors,
      sessionDate: sessionDate
    })

    createSession({
      sessionName: sessionName,
      sessionTitle: sessionTitle,
      companyName: companyName,
      event: event,
      files: files,
      startTime: startTime,
      translationLanguages: translationLanguages,
      translationPrice: translationPrice,
      yourLanguage: yourLanguage,
      sponsors: sponsors,
      sessionDate: sessionDate
    }).then((response) => {
      window.location.href = `/sessions/${response.data.sessionId}`
    });
  }

  render() {
    const { myEvents, mySponsors } = this.state;
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Create session"
                content={
                  <div>
                    <FormGroup controlId="sessionName">
                      <ControlLabel>Presentor name</ControlLabel>
                      <FormControl
                        componentClass="input"
                        bsClass="form-control"
                        placeholder="Input presentor's name."
                        onChange={this.handleNameChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="companyName">
                      <ControlLabel>Company or Organization name</ControlLabel>
                      <FormControl
                        componentClass="input"
                        bsClass="form-control"
                        placeholder="Input Company or Organization name."
                        onChange={this.handleCompanyNameChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="event" className="col-md-6" style={{paddingLeft: "0px"}}>
                      <ControlLabel>Event</ControlLabel>
                        <FormControl
                          componentClass="select"
                          bsClass="form-control"
                          onChange={this.handleEventChange}
                        >
                          {myEvents.map((eve, idx) => {
                            return (
                              <option key={idx}>{eve.name}</option>
                            )
                          })}
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="yourLanguage" className="col-md-6" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                      <ControlLabel>Your Language</ControlLabel>
                      <FormControl
                        componentClass="select"
                        bsClass="form-control"
                        placeholder="Input the envent name."
                        onChange={this.handleYourLanguageChange}
                      >
                          {languages.map((language, idx) => {
                            return (
                              <option key={idx}>{language.name}</option>
                            )
                          })}
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="translationLanguage" style={{paddingRight: "0px"}}>
                      <ControlLabel>Translation Language</ControlLabel>
                      <Multiselect
                        id="translation_select"
                        options={languages}
                        onSelect={this.handleTransLanguageSelect}
                        onRemove={this.handleTransLanguageRemove}
                        closeIcon="cancel"
                        displayValue="name"
                      />
                    </FormGroup>
                    <FormGroup controlId="sessonTitle" className="col-md-12" style={{paddingLeft: "0px"}}>
                      <ControlLabel>Session Title</ControlLabel>
                      <FormControl
                        componentClass="input"
                        bsClass="form-control"
                        placeholder="Input the session title."
                        onChange={this.handleTitleChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="eventName" className="col-md-4" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                      <ControlLabel>From</ControlLabel>
                      <DayPickerInput
                        id="sessionDate"
                        format="YYYY-MM-DD"
                        onDayChange={this.handleDayChange}
                        className="form-control"
                      />
                    </FormGroup>
                    <FormGroup controlId="eventName" className="col-md-4" style={{paddingLeft: "20px"}}>
                      <ControlLabel>Time(From - To)</ControlLabel>
                      <div style={{display: "flex", margin: "0px 10px"}}>
                        <TimeInputPolyfill id="timeFrom" className="session-timepicker form-control" step={900} onChange={this.handleFromTimeChange}/>
                        <TimeInputPolyfill id="timeTo" className="session-timepicker form-control" step={900} onChange={this.handleToTimeChange}/>
                      </div>
                    </FormGroup>
                    <FormGroup controlId="translationPrice" className="col-md-4" style={{paddingRight: "0px"}}>
                      <ControlLabel>Translation Price</ControlLabel>
                      <FormControl
                        componentClass="input"
                        type="number"
                        bsClass="form-control"
                        placeholder="Translation Price"
                        onChange={this.handleTranslationPriceChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="relatedFile" className="col-md-12" style={{paddingRight: "0px", paddingLeft: "0px"}}>
                      <ControlLabel>Files</ControlLabel>
                      <div className="custom-file">
                        <input id="inputGroupFile01" type="file" multiple className="custom-file-input from-control" />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">Choose files</label>
                      </div>
                    </FormGroup>
                    <FormGroup controlId="sponsors">
                      <ControlLabel>Sponsors</ControlLabel>
                      <Multiselect
                        options={mySponsors}
                        onSelect={this.handleSponsorSelect}
                        onRemove={this.handleSponsorRemove}
                        closeIcon="cancel"
                        displayValue="name"
                      />
                    </FormGroup>                    

                    <Button bsStyle="info" pullRight fill type="submit" onClick={this.handleCreate}>
                      Create
                    </Button>
                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default CreateSession;
