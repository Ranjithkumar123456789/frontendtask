import React, { useState } from 'react';
import { Input, Button, Select, Card } from 'antd';

const { Option } = Select;

const FieldRow = ({ field, onChange, onDelete }) => {
    const handleKeyChange = (e) => {
        onChange({ ...field, key: e.target.value });
    };

    const handleTypeChange = (value) => {
        const updatedField = { ...field, type: value };
        if (value === 'Nested' && !field.children) {
            updatedField.children = [];
        }
        onChange(updatedField);
    };

    const handleAddNestedField = () => {
        const newChild = { key: '', type: 'String' };
        onChange({ ...field, children: [...(field.children || []), newChild] });
    };

    const handleChildChange = (index, updatedChild) => {
        const updatedChildren = [...(field.children || [])];
        updatedChildren[index] = updatedChild;
        onChange({ ...field, children: updatedChildren });
    };

    const handleDeleteChild = (index) => {
        const updatedChildren = [...(field.children || [])];
        updatedChildren.splice(index, 1);
        onChange({ ...field, children: updatedChildren });
    };

    return (
        <Card style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
                <Input
                    placeholder="Field Key"
                    value={field.key}
                    onChange={handleKeyChange}
                />
                <Select value={field.type} onChange={handleTypeChange} style={{ width: 120 }}>
                    <Option value="String">String</Option>
                    <Option value="Number">Number</Option>
                    <Option value="Nested">Nested</Option>
                </Select>
                <Button danger onClick={onDelete}>Delete</Button>
            </div>

            {field.type === 'Nested' && (
                <div style={{ marginLeft: 20, marginTop: 10 }}>
                    <Button onClick={handleAddNestedField} type="dashed">Add Nested Field</Button>
                    {field.children?.map((child, idx) => (
                        <FieldRow
                            key={idx}
                            field={child}
                            onChange={(updatedChild) => handleChildChange(idx, updatedChild)}
                            onDelete={() => handleDeleteChild(idx)}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

export const SchemaBuilder = () => {
    const [fields, setFields] = useState([]);

    const addField = () => {
        setFields([...fields, { key: '', type: 'String' }]);
    };

    const handleFieldChange = (index, updatedField) => {
        const updatedFields = [...fields];
        updatedFields[index] = updatedField;
        setFields(updatedFields);
    };

    const handleFieldDelete = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
    };

    const generateJSON = (fields) => {
        const result = {};
        fields.forEach(field => {
            if (field.type === 'Nested') {
                result[field.key || 'unnamed'] = generateJSON(field.children || []);
            } else {
                result[field.key || 'unnamed'] = field.type === 'String' ? 'sample string' : 0;
            }
        });
        return result;
    };

    return (
        <div style={{ padding: 20 }}>
            <Button type="primary" onClick={addField}>Add Field</Button>

            {fields.map((field, idx) => (
                <FieldRow
                    key={idx}
                    field={field}
                    onChange={(updatedField) => handleFieldChange(idx, updatedField)}
                    onDelete={() => handleFieldDelete(idx)}
                />
            ))}

            <h3 style={{ marginTop: 30 }}>Generated JSON:</h3>
            <pre style={{
                backgroundColor: '#0a0a0aff',
                padding: 15,
                borderRadius: 5,
                maxHeight: 400,
                overflow: 'auto'
            }}>
                {JSON.stringify(generateJSON(fields), null, 2)}
            </pre>
        </div>
    );
};
