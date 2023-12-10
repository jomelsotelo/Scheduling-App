
import React from "react";
import EditAccount from "../../components/AccountInfo";


function Account(){
    return (
        <div className="account-information">
          <div className="form">
            <div className="account">
              <div className="account-header">
                <h3>Account Edit</h3>
                <p>Here is all the information you can edit!</p>
              </div>
            </div>
            <EditAccount />
          </div>
        </div>
      );
}

export default Account;