//homepage

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home(props) {
    return (
        <div>
            <h1>"Hello World"</h1>
            <button>
                <Link className="dealers" to="/dealers">
                    Dealers
                </Link>
            </button>
        </div>
    );
}
