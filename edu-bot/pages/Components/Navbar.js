import React from 'react';
import Select from 'react-select';
 
const Navbar = ({ userLang, setUserLang}) => {
    const languages = [
        // { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" }
    ];

    return (
        <div className="navbar">
            <h1>Code Compiler</h1>
            <Select options={languages} value={userLang} onChange={(e)=>setUserLang(e.value)} placeholder={userLang}/>
        </div>
    )
}
 
export default Navbar