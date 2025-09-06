"use client";
import React, {useContext} from "react";
import Link from "next/link";
import {
  ROUTE_DATAINSPECTOR,
  ROUTE_HOME,
  ROUTE_INSIGHTS,
  ROUTE_MONTHLY,
  ROUTE_STATISTICS,
  ROUTE_YEARLY
} from "../../routes";
import {DataContext} from "../providers/DataProvider";
import isEmpty from 'lodash/isEmpty';

export default function Header() {
  const dataContext = useContext(DataContext);

  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark" aria-label="Third navbar example">
        <div className="container">
          <Link href={ROUTE_HOME} as={ROUTE_HOME} className="navbar-brand">

            <img src="/icons/euro_symbol.svg"
                 width="30"
                 height="30"
                 alt="EZ-Budget"
                 className="d-inline-block align-top"/>EZ-Budget
          </Link>
          {
            !isEmpty(dataContext.dataContainer) &&
            <a className="nav-link disabled mobile__show" href="#"
               aria-disabled="true">
              <span className="dot__green"></span>
            </a>
          }
          {
            isEmpty(dataContext.dataContainer) &&
            <a className="nav-link disabled mobile__show" href="#"
               aria-disabled="true">
              <span className="dot__red"></span>
            </a>
          }
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded="true"
                  aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar-collapse collapse" id="navbarsExample03">
            <ul className="navbar-nav me-auto mb-2 mb-sm-0">
              {
                !isEmpty(dataContext.dataContainer) &&
                <li className="nav-item">
                  <Link href={ROUTE_MONTHLY} className="nav-link">
                    Monat
                  </Link>
                </li>
              }
              {
                !isEmpty(dataContext.dataContainer) &&
                <li className="nav-item">
                  <Link href={ROUTE_YEARLY} className="nav-link">
                    Jahr
                  </Link>
                </li>
              }
              {
                !isEmpty(dataContext.dataContainer) &&
                <li className="nav-item">
                  <Link href={ROUTE_STATISTICS} className="nav-link">
                    Ergebnisse
                  </Link>
                </li>
              }
              {
                !isEmpty(dataContext.dataContainer) &&
                <li className="nav-item">
                  <Link href={ROUTE_INSIGHTS} className="nav-link">
                    Insights
                  </Link>
                </li>
              }
              <li className="nav-item">
                {
                  !isEmpty(dataContext.dataContainer) &&
                  <a className="nav-link disabled" href="#"
                     aria-disabled="true">
                    <span className="green">Daten geladen</span>
                  </a>
                }
                {
                  isEmpty(dataContext.dataContainer) &&
                  <a className="nav-link disabled" href="#"
                     aria-disabled="true">
                    <span className="red">Keine Daten geladen</span>
                  </a>
                }
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
