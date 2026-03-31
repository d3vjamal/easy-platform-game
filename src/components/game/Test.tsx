
import React from 'react';

interface SampleComponentProps {
    title?: string;
    message?: string;
}

const SampleComponent: React.FC<SampleComponentProps> = ({
    title = "Sample Component",
    message = "Hello, World!"
}) => {
    const [count, setCount] = React.useState<number>(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div className="sample-component">
            <h2>{title}</h2>
            <p>{message}</p>
            <div>
                <p>Count: {count}</p>
                <button onClick={handleClick}>
                    Click me
                </button>
            </div>
        </div>
    );
};

export default SampleComponent;