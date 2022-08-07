/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dealers(props) {
    const [dealer, setDealer] = useState();
    const navigate = useNavigate();

    function clickHandle(dealerName) {
        let path = `/dealer/${dealerName}`;
        navigate(path);
    }

    useEffect(() => {
        fetch("/api/dealerShowcase")
            .then((res) => res.json())
            .then((showcase) => {
                let dealerCard = showcase
                    .sort((a, b) => a.dealerName.localeCompare(b.dealerName))
                    .map((dealer) => {
                        return (
                            <div
                                className="dealer-card-container"
                                key={dealer.dealerName}
                            >
                                <img
                                    className="dealer-showcase"
                                    alt={dealer.dealerName + " showcase"}
                                    src={dealer.image}
                                    onClick={() =>
                                        clickHandle(dealer.dealerName)
                                    }
                                />
                                <div className="dealer-name">
                                    {dealer.dealerName}
                                </div>
                            </div>
                        );
                    });
                setDealer(dealerCard);
            });
    }, []);

    return <div className="dealerGrid">{dealer}</div>;
}
