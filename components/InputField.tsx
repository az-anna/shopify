import React from 'react';

function InputField (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLInputElement> & React.InputHTMLAttributes<HTMLInputElement>) {
    const className = `px-3 py-1 rounded-md border border-slate-200 focus:border-indigo-400 bg-slate-100 focus:bg-white focus:border-1 focus:outline-none st ${props.className || ''}`
    return (
        <div className='flex flex-col'>
            <label className='block mb-1 text-sm font-semibold text-gray-700'>
                {props.label}
            </label>
            <input {...props} className={className}/>
        </div>
    );
}

export default InputField;