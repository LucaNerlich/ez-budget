import React from "react";
import YearSummary from "./YearSummary";

export default function Overview(props) {
    return (
        <div>
            <h1>
                Deine aggregierten Ergebnisse
            </h1>

            <h2>Pro Jahr</h2>
            <YearSummary/>
        </div>
    );
}
