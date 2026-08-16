"use client";
import React, {useContext} from "react";
import Link from 'next/link'
import AppVersion from "./AppVersion";
import {useCookies} from "react-cookie";
import {COOKIE_LOAD_VIA_URL, COOKIE_REMOTE_FILE_URL} from "../../constants";
import {
    ROUTE_DATAINSPECTOR,
    ROUTE_JSON_GENERATOR,
    ROUTE_TEMPLATE,
    ROUTE_TESTDATA,
    ROUTE_TESTDATA_GENERATOR
} from "../../routes";
import {DataContext} from "../providers/DataProvider";

export default function Footer() {
    const [removeCookie] = useCookies();
    const dataContext = useContext(DataContext);

    // delete all cookies
    function deleteCookies() {
        removeCookie(COOKIE_LOAD_VIA_URL)
        removeCookie(COOKIE_REMOTE_FILE_URL)
    }

    function unloadData() {
        dataContext.setDataContainer({})
    }

    return (
      <footer className="mt-5">
          <div className="container">
              <div className="mt-3 alert alert-info" role="alert">
                  Die Daten verlassen <strong>niemals</strong> dein Gerät. Alle Berechnungen werden lokal
                  durchgeführt.
              </div>

              <AppVersion builtBy/>

              <Link href={ROUTE_JSON_GENERATOR} className="btn btn-link">
                  Json Generator
              </Link>
              <Link href={ROUTE_DATAINSPECTOR} className="btn btn-link">
                  DataInspector
              </Link>
              <Link href={ROUTE_TESTDATA} download className="btn btn-link">
                  Beispieldatei runterladen
              </Link>
              <Link href={ROUTE_TESTDATA_GENERATOR} className="btn btn-link">
                  Beispieldaten generieren
              </Link>
              <div className="col">
                  <button type="button" className="btn btn-link" onClick={deleteCookies}>
                      Cookies löschen
                  </button>
                  <button type="button" className="btn btn-link" onClick={unloadData}>
                      Geladene Daten resetten
                  </button>
                  <Link href={ROUTE_TEMPLATE} download className="btn btn-link">
                      Leeres Template runterladen
                  </Link>
              </div>
          </div>
      </footer>
    );
}
