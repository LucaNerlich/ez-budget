"use client";
import React, {useContext, useEffect, useState, useActionState} from "react";
import 'moment/locale/de';
import {useCookies} from "react-cookie";
import {COOKIE_LOAD_VIA_URL, COOKIE_REMOTE_FILE_URL} from "../../../constants";
import {DataContext} from "../../providers/DataProvider";
import {fetchRemoteJsonAction, parseLocalJsonAction} from '../../../app/actions'
import testData from '../../../public/testdata.json'
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/navigation'
import {ROUTE_MONTHLY} from "../../../routes";

export default function MainInput(props) {
  const dataContext = useContext(DataContext);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [fileName, setFileName] = useState(null)
  const [loadViaUrl, setLoadViaUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remoteFileUrl, setRemoteFileUrl] = useState("");

  const [remoteState, fetchRemoteAction] = useActionState(fetchRemoteJsonAction, { ok: false });
  const [localState, parseLocalAction] = useActionState(parseLocalJsonAction, { ok: false });

  // on page load, set states from cookie
  useEffect(() => {
    setRemoteFileUrl(cookies[COOKIE_REMOTE_FILE_URL] ? cookies[COOKIE_REMOTE_FILE_URL] : "")
    setLoadViaUrl(cookies[COOKIE_LOAD_VIA_URL] ? cookies[COOKIE_LOAD_VIA_URL] === 'true' : false)
  }, [])

  // on data change: reset success when empty, redirect to monthly when loaded
  useEffect(() => {
    if (isEmpty(dataContext.dataContainer)) {
      setSuccess(false);
    } else {
      router.push(ROUTE_MONTHLY);
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

  useEffect(() => {
    if (remoteState && remoteState.ok && remoteState.data) {
      dataContext.setDataContainer(remoteState.data);
      setError(false);
      setSuccess(true);
      setLoading(false);
      router.push(ROUTE_MONTHLY);
    } else if (remoteState && remoteState.error) {
      console.error(remoteState.error);
      setError(true);
      setLoading(false);
    }
  }, [remoteState])

  useEffect(() => {
    if (localState && localState.ok && localState.data) {
      dataContext.setDataContainer(localState.data);
      setError(false);
      setSuccess(true);
      setLoading(false);
      router.push(ROUTE_MONTHLY);
    } else if (localState && localState.error) {
      console.error(localState.error);
      setError(true);
      setLoading(false);
    }
  }, [localState])

// https://share.lucanerlich.com/s/fxSC52oREjRgdWE/download/testdata.json

  function useTestData() {
    setSuccess(true)
    dataContext.setDataContainer(testData);
  }

  return (
    <div>
        <div className="mt-3 mb-3">
          <h1 className="mb-3">Dateiupload</h1>

          <div className="form-check form-switch mt-3 mb-3">
            <input onChange={(e) => setLoadViaUrl(!loadViaUrl)}
                   className="form-check-input"
                   type="checkbox"
                   checked={loadViaUrl}
                   role="switch" id="flexSwitchCheckDefault"/>
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Lade .json/.yaml via URL
            </label>
          </div>

          {/* File Browser */}
          {!loadViaUrl &&
            <form action={parseLocalAction}>
              <div className="input-group mb-3">
                <input type="file"
                       name="localJson"
                       placeholder="C:\\Users\\Luca\\mydata.(json|yaml|yml)"
                       accept="application/json,application/x-yaml,text/yaml,.yaml,.yml,.json"
                       onChange={(e) => {
                         if (e.target.files[0]) {
                           setFileName(e.target.files[0].name)
                         }
                       }}
                       className="form-control"
                       id="local-json"/>
                <button type="submit" className="btn btn-secondary">Laden</button>
              </div>
            </form>
          }

          {/* Link Field */}
          {loadViaUrl &&
            <form action={fetchRemoteAction}>
              <div className="input-group mb-3">
                <span className="input-group-text">URL</span>
                <input type="text"
                       name="remoteUrl"
                       placeholder="https://mycloud.com/mydata.(json|yaml|yml)"
                       className="form-control"
                       value={remoteFileUrl}
                       onChange={(e) => {
                         setRemoteFileUrl(e.target.value)
                       }}
                       id="remote-json"
                       aria-describedby="basic-addon3"/>
                <button type="submit" className="btn btn-secondary">Laden</button>
              </div>
            </form>
          }


          <div className="mt-3">
            <button type="button" onClick={useTestData} className="btn btn-link">
              Beispieldatei verwenden
            </button>
          </div>
        </div>

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
