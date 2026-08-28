"use client";
import React, {useActionState, useContext, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {COOKIE_LOAD_VIA_URL, COOKIE_REMOTE_FILE_URL} from "../../../constants";
import {DataContext} from "../../providers/DataContext";
import {fetchRemoteJsonAction, parseLocalJsonAction} from '../../../app/actions'
import testData from '../../testdata.yaml'
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/navigation'
import {ROUTE_MONTHLY} from "../../../routes";

export default function MainInput(props) {
  const dataContext = useContext(DataContext);
  const router = useRouter();
  const [cookies, setCookie] = useCookies();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loadViaUrl, setLoadViaUrl] = useState(false);
  const [remoteFileUrl, setRemoteFileUrl] = useState("");

  // on page load, set states from cookie (browser-only values that can't be
  // read during SSR without hydration mismatches)
  useEffect(() => {
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    setRemoteFileUrl(cookies[COOKIE_REMOTE_FILE_URL] ? cookies[COOKIE_REMOTE_FILE_URL] : "")
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    setLoadViaUrl(cookies[COOKIE_LOAD_VIA_URL] ? cookies[COOKIE_LOAD_VIA_URL] === 'true' : false)
  }, [cookies])

  // persist the last used source as cookies
  useEffect(() => {
    let expiryDate = new Date()
    expiryDate.setTime(expiryDate.getTime() + (365 * 24 * 60 * 60 * 1000));

    setCookie(COOKIE_REMOTE_FILE_URL, remoteFileUrl, {path: '/', expires: expiryDate, sameSite: true, secure: true})
    setCookie(COOKIE_LOAD_VIA_URL, loadViaUrl, {path: '/', expires: expiryDate, sameSite: true, secure: true})
  }, [remoteFileUrl, loadViaUrl, setCookie])

  async function fetchAndApply(prevState, formData) {
    const result = await fetchRemoteJsonAction(prevState, formData);
    return applyParseResult(result);
  }

  async function parseAndApply(prevState, formData) {
    const result = await parseLocalJsonAction(prevState, formData);
    return applyParseResult(result);
  }

  // Apply the parse result inside the submit handler (not an effect) and hand
  // it to useActionState for rendering.
  async function applyParseResult(state) {
    if (state && state.ok && state.data) {
      dataContext.setDataContainer(state.data);
      setError(false);
      setSuccess(true);
      router.push(ROUTE_MONTHLY);
    } else if (state && state.error) {
      console.error(state.error);
      setError(true);
      setSuccess(false);
    }
    return state;
  }

  const [remoteState, fetchRemoteAction] = useActionState(fetchAndApply, {ok: false});
  const [localState, parseLocalAction] = useActionState(parseAndApply, {ok: false});

  function handleLoadViaUrlChange() {
    setLoadViaUrl(!loadViaUrl);
    setSuccess(false);
    setError(false);
  }

  function handleRemoteFileUrlChange(e) {
    setRemoteFileUrl(e.target.value);
    setSuccess(false);
    setError(false);
  }

  function handleFileSelected(e) {
    setSuccess(false);
    setError(false);
    return e.target.files[0]?.name ?? null;
  }

  function useTestData() {
    setSuccess(true)
    dataContext.setDataContainer(testData);
    router.push(ROUTE_MONTHLY);
  }

  return (
    <div className="upload-panel">
      <div className="mt-3 mb-3">
        <h1 className="mb-2">Dateiupload</h1>
        <p className="mb-4">Lade deine <strong>.json</strong> oder <strong>.yaml</strong> Datei –
          alle Berechnungen passieren lokal in deinem Browser.</p>

        <div className="form-check form-switch mt-3 mb-3">
          <input onChange={handleLoadViaUrlChange}
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
              <label htmlFor="local-json" className="input-group-text">Datei</label>
              <input type="file"
                     name="localJson"
                     placeholder="C:\\Users\\Luca\\mydata.(json|yaml|yml)"
                     accept="application/json,application/x-yaml,text/yaml,.yaml,.yml,.json"
                     onChange={handleFileSelected}
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
              <label htmlFor="remote-json" className="input-group-text">URL</label>
              <input type="text"
                     name="remoteUrl"
                     placeholder="https://mycloud.com/mydata.(json|yaml|yml)"
                     className="form-control"
                     value={remoteFileUrl}
                     onChange={handleRemoteFileUrlChange}
                     id="remote-json"/>
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

      {success && !isEmpty(dataContext.dataContainer) &&
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
