"use client";
import React, {useContext} from 'react';
import Layout from '../../src/components/Layout';
import {DataContext} from '../../src/providers/DataProvider';
import {jsFriendlyJSONStringify} from '../../src/Util';

export default function DataInspectorPage() {
  const dataContext = useContext(DataContext);

  return (
    <Layout>
      <h1>DataInspector</h1>
      <h2>Errechnete Statistiken</h2>
      <pre className="shadow">{jsFriendlyJSONStringify(dataContext.statsContainer)}</pre>

      {dataContext.statsContainer && dataContext.statsContainer.length > 0 &&
        <a href={`data:text/json;charset=utf-8,${encodeURIComponent(jsFriendlyJSONStringify(dataContext.statsContainer))}`}
           download="ezbudget-statistiken.json"
           className="mt-3 btn btn-primary">
          Statistiken herunterladen
        </a>
      }
      <hr/>
      <h2>Hochgeladene Datei</h2>
      <pre className="shadow">{jsFriendlyJSONStringify(dataContext.dataContainer)}</pre>
    </Layout>
  );
}


