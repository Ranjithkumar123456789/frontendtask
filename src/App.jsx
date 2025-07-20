import React from 'react';
import { SchemaBuilder } from './assets/Components/Schemabuilder';
import 'antd/dist/reset.css';

function App() {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>JSON Schema Builder</h1>
            <SchemaBuilder />
        </div>
    );
}

export default App;
