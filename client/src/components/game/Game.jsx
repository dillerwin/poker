import "./game.css";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import Cardtable from "./Cardtable";
import GameDealer from "./GameDealer";
import { useCallback } from "react";

export default function Game({ refreshDealerArray }) {
    //useRef carries over between re-renders
    //access useRef items from {ref}.current
    const outfit = useRef({});
    const totalOutfits = useRef();
    const picRefArray = useRef([]);
    const [currentImg, setCurrentImg] = useState({ image: "", idx: 0 });
    const [value, setValue] = useState(false);

    let imgInfo = useRef({ image: "", idx: 0 });

    const { outfitId } = useParams();

    console.log("outfitId", outfitId);

    function advDealer() {
        imgInfo = {
            image: picRefArray.current[currentImg.idx + 1],
            idx: currentImg.idx + 1,
        };
        console.log("imgInfo pt2", imgInfo);
        setCurrentImg(imgInfo);
    }

    useEffect(() => {
        console.log("picRefArray", picRefArray.current);
        if (refreshDealerArray.current) {
            refreshDealerArray.current = false;
            console.group("picArray.current.length < 1");
            console.log("outfitId", outfitId);
            console.groupEnd();
            fetch(`/api/play/${outfitId}`)
                .then((res) => res.json())
                .then((outfitInfo) => {
                    console.log("outfitInfo", outfitInfo);

                    outfitInfo[0].pictures.forEach((pic) =>
                        picRefArray.current.push(pic)
                    );
                    setCurrentImg({ image: outfitInfo[0].pictures[0], idx: 0 });
                });
        }
    }, []);

    return (
        <div className="game-container">
            <Cardtable advDealer={advDealer} />
            <GameDealer currentImg={currentImg} />
        </div>
    );
}
