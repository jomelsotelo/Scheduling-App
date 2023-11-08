import { Link } from "react-router-dom";
import React from 'react';

function Calendar() {
  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Calendar</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="content w-100">
              <div className="calendar-container">
                <div className="calendar">
                  <div className="year-header">
                    <span className="left-button fa fa-chevron-left" id="prev"></span>
                    <span className="year" id="label"></span>
                    <span className="right-button fa fa-chevron-right" id="next"></span>
                  </div>
                  <table className="months-table w-100">
                    <tbody>
                      <tr className="months-row">
                        <td className="month">Jan</td>
                        <td className="month">Feb</td>
                        <td className="month">Mar</td>
                        <td className="month">Apr</td>
                        <td className="month">May</td>
                        <td className="month">Jun</td>
                        <td className="month">Jul</td>
                        <td className="month">Aug</td>
                        <td className="month">Sep</td>
                        <td className="month">Oct</td>
                        <td className="month">Nov</td>
                        <td className="month">Dec</td>
                      </tr>
                    </tbody>
                  </table>
                  <table className="days-table w-100">
                    <td className="day">Sun</td>
                    <td className="day">Mon</td>
                    <td className="day">Tue</td>
                    <td className="day">Wed</td>
                    <td className="day">Thu</td>
                    <td className="day">Fri</td>
                    <td className="day">Sat</td>
                  </table>
                  <div className="frame">
                    <table className="dates-table w-100">
                      <tbody className="tbody"></tbody>
                    </table>
                  </div>
                  <button className="button" id="add-button">Add Event</button>
                  <button
                    id="edit-button"
                    className="edit-button"
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    EDIT Event
                  </button>
                </div>
              </div>
              <div className="events-container"></div>
              <div className="dialog" id="dialog">
                <h2 className="dialog-header">Add New Event</h2>
                <form className="form" id="form">
                  <div className="form-container" align="center">
                    <label className="form-label" id="valueFromMyButton" htmlFor="name">
                      Event name
                    </label>
                    <input className="input" type="text" id="name" maxLength="36" />
                    <label className="form-label" id="valueFromMyButton" htmlFor="startTime">
                      Availiable Time
                    </label>
                    <input className="input" type="time" id="startTime" name="startTime" />
                    <label className="form-label" id="valueFromMyButton" htmlFor="endTime">
                      End Time
                    </label>
                    <input className="input" type="time" id="endTime" name="endTime" />
                    <label className="form-label" id="valueFromMyButton" htmlFor="count">
                      People Attending
                    </label>
                    <input className="input" type="number" id="count" min="0" max="1000000" maxLength="7" />
                    <input type="button" value="Cancel" className="button" id="cancel-button" />
                    <input type="button" value="OK" className="button button-white" id="ok-button" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
}

export default Calendar;
