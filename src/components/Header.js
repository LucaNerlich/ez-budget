"use client";
import React, {useContext} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  ROUTE_HOME,
  ROUTE_INSIGHTS,
  ROUTE_MONTHLY,
  ROUTE_STATISTICS,
  ROUTE_YEARLY
} from "../../routes";
import {DataContext} from "../providers/DataProvider";
import isEmpty from 'lodash/isEmpty';
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const dataContext = useContext(DataContext);
  const pathname = usePathname();
  const hasData = !isEmpty(dataContext.dataContainer);

  const links = [
    {href: ROUTE_MONTHLY, label: "Monat"},
    {href: ROUTE_YEARLY, label: "Jahr"},
    {href: ROUTE_STATISTICS, label: "Ergebnisse"},
    {href: ROUTE_INSIGHTS, label: "Insights"},
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-sm app-navbar" aria-label="Hauptnavigation">
        <div className="container">
          <Link href={ROUTE_HOME} className="navbar-brand">
            <img src="/icons/euro_symbol.svg"
                 width="26"
                 height="26"
                 alt=""
                 aria-hidden="true"/>
            EZ-Budget
          </Link>

          <div className="d-flex align-items-center gap-2 ms-auto order-sm-last">
            <ThemeToggle/>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false"
                    aria-label="Navigation umschalten">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="navbar-collapse collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-sm-0">
              {hasData && links.map(({href, label}) => (
                <li className="nav-item" key={href}>
                  <Link href={href}
                        className={`nav-link${pathname === href ? ' active' : ''}`}
                        aria-current={pathname === href ? 'page' : undefined}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-2 mt-sm-0 me-sm-3">
              <span className={`status-pill${hasData ? ' is-loaded' : ''}`}>
                <span className="status-dot"></span>
                {hasData ? 'Daten geladen' : 'Keine Daten'}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
