import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Dealer(props) {
    const [outfits, setOutfits] = useState();
    const { dealerName } = useParams();

    const navigate = useNavigate();

    const clickHandle = useCallback((outfitId, dealerName) => {
        props.refreshDealerArray.current = true;
        props.outfitId.current = outfitId;
        props.dealerName.current = dealerName;
        navigate(`/play`);
    }, []);

    useEffect(() => {
        fetch("/api/dealerList")
            .then((res) => res.json())
            .then((dealers) => {
                console.log("dealerList firing");
                props.dealerList.current = dealers;
            });
    }, []);

    useEffect(() => {
        fetch(`/api/dealer/${dealerName}`)
            .then((res) => res.json())
            .then((dealerInfo) => {
                let dealer = dealerInfo.shift(),
                    outfits = dealerInfo;
                let outfitCard = outfits
                    .sort((a, b) => a.outfitId.localeCompare(b.outfitId))
                    .map((outfit) => {
                        return (
                            <div
                                className="outfit-container"
                                key={outfit.outfitId}
                            >
                                <img
                                    className="outfitImg"
                                    alt={
                                        outfit.dealerName +
                                        outfit.outfitId.slice(-1)
                                    }
                                    src={outfit.pictures[0]}
                                    onClick={() =>
                                        clickHandle(
                                            outfit.outfitId,
                                            outfit.dealerName
                                        )
                                    }
                                />
                            </div>
                        );
                    });
                setOutfits(outfitCard);
            });
    }, []);

    return (
        <>
            <div>{dealerName}</div>
            <div className="outfitGrid">{outfits}</div>
        </>
    );
}
