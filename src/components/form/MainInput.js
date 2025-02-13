import React, {useContext, useEffect, useState} from "react";
import 'moment/locale/de';
import {useCookies} from "react-cookie";
import {COOKIE_LOAD_VIA_URL, COOKIE_REMOTE_FILE_URL} from "../../../constants";
import {DataContext} from "../../../pages/_app";
import axios from "axios";
import testData from '../../../public/testdata.json'
import * as _ from "lodash";

export default function MainInput(props) {
  const dataContext = useContext(DataContext);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fileName, setFileName] = useState(null)
  const [loadViaUrl, setLoadViaUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remoteFileUrl, setRemoteFileUrl] = useState("");

  // on page load, set states from cookie
  useEffect(() => {
    setRemoteFileUrl(cookies[COOKIE_REMOTE_FILE_URL] ? cookies[COOKIE_REMOTE_FILE_URL] : "")
    setLoadViaUrl(cookies[COOKIE_LOAD_VIA_URL] ? cookies[COOKIE_LOAD_VIA_URL] === 'true' : false)
  }, [])

  // on data unload, reset success alert
  useEffect(() => {
    if (_.isEmpty(dataContext.dataContainer)) {
      setSuccess(false);
    }
  }, [dataContext.dataContainer])

  // handle cookies
  useEffect(() => {
    setSuccess(false);
    setError(false)
    let expiryDate = new Date()
    expiryDate.setTime(expiryDate.getTime() + (365 * 24 * 60 * 60 * 1000));

    setCookie(COOKIE_REMOTE_FILE_URL, remoteFileUrl, {path: '/', expires: expiryDate, sameSite: true, secure: true})
    setCookie(COOKIE_LOAD_VIA_URL, loadViaUrl, {path: '/', expires: expiryDate, sameSite: true, secure: true})
  }, [fileName, remoteFileUrl, loadViaUrl])

  // test link
  function executeGET() {
    axios.post('/api/getFile', {url: remoteFileUrl})
      .then(result => {
        dataContext.setDataContainer(result.data)
        setError(false);
        setSuccess(true);
        setLoading(false)
      })
      .catch(error => {
        console.error(error);
        setError(true)
        setLoading(false)
      })
  }

// https://share.lucanerlich.com/s/fxSC52oREjRgdWE/download/testdata.json
  const onSubmit = async (e) => {
    e.preventDefault();

    // reset alerts
    setSuccess(false)
    setError(false)
    setLoading(true)

    e.preventDefault();
    if (loadViaUrl) {
      if (remoteFileUrl && remoteFileUrl.length > 0) {
        executeGET();
      } else {
        setError(true)
        setLoading(false)
      }
    } else {
      if (e.target[1].files[0]) {
        dataContext.setFileName(e.target[1].files[0].name)
        // load file
        e.target[1].files[0].text()
          .then(result => {
            dataContext.setDataContainer(JSON.parse(result))
            setSuccess(true);
            setLoading(false)
          })
          .catch(error => {
            console.error(error);
            setError(true);
            setLoading(false)
          })
      } else {
        setError(true);
        setLoading(false)
      }
    }
  };

  function useTestData() {
    setSuccess(true)
    dataContext.setDataContainer(testData);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="mt-3 mb-3">
          <h1 className="mb-3">Dateiupload</h1>

          <div className="form-check form-switch mt-3 mb-3">
            <input onChange={(e) => setLoadViaUrl(!loadViaUrl)}
                   className="form-check-input"
                   type="checkbox"
                   checked={loadViaUrl}
                   role="switch" id="flexSwitchCheckDefault"/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Lade .json via URL
            </label>
          </div>

          {/* File Browser */}
          {!loadViaUrl &&
            <div>
              <div className="input-group mb-3">
                <input type="file"
                       placeholder="C:\Users\Luca\mydata.json"
                       accept="application/json"
                       onChange={(e) => {
                         if (e.target.files[0]) {
                           setFileName(e.target.files[0].name)
                         }
                       }}
                       className="form-control"
                       id="local-json"/>
              </div>
            </div>
          }

          {/* Link Field */}
          {loadViaUrl &&
            <div>
              <div className="input-group mb-3">
                <span className="input-group-text">URL</span>
                <input type="text"
                       placeholder="https://mycloud.com/mydata.json"
                       className="form-control"
                       value={remoteFileUrl}
                       onChange={(e) => {
                         setRemoteFileUrl(e.target.value)
                       }}
                       id="remote-json"
                       aria-describedby="basic-addon3"/>
              </div>
            </div>
          }


          {/*Submit*/}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Datei einlesen
            </button>
            <button type="button" onClick={useTestData} className="btn btn-link">
              Beispieldatei verwenden
            </button>
          </div>
        </div>
      </form>

      {success &&
        <div className="mt-3 alert alert-success" role="alert">
          Erfolgreich eingelesen.
        </div>
      }

      {error &&
        <div className="mt-3 alert alert-danger" role="alert">
          Fehler beim Upload.
        </div>
      }
    </div>
  );
}
