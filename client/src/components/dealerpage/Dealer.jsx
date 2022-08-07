/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Dealer(props) {
    const [outfits, setOutfits] = useState();
    const { dealerName } = useParams();

    const navigate = useNavigate();

    const clickHandle = useCallback((outfitId) => {
        console.log("clicked");
        props.refreshDealerArray.current = true;
        navigate("/play/" + outfitId);
    });

    useEffect(() => {
        fetch(`/api/dealer/${dealerName}`)
            .then((res) => res.json())
            .then((dealerInfo) => {
                let dealer = dealerInfo.shift(),
                    outfits = dealerInfo;
                console.log("dealer", dealer);
                console.log("outfits", outfits);
                let outfitCard = outfits.map((outfit) => {
                    return (
                        <div className="outfit-container" key={outfit.outfitId}>
                            <img
                                className="outfitImg"
                                alt={
                                    outfit.dealerName +
                                    outfit.outfitId.slice(-1)
                                }
                                src={outfit.pictures[0]}
                                onClick={() => clickHandle(outfit.outfitId)}
                            />
                        </div>
                    );
                });
                setOutfits(outfitCard);
            });
    }, [dealerName]);

    return (
        <>
            <div>{dealerName}</div>
            <div className="outfitGrid">{outfits}</div>
        </>
    );
}
