import "./game.css";
import React, { useEffect, useState, useRef } from "react";
import Cardtable from "./Cardtable";
import GameDealer from "./GameDealer";
import { getNewDealer } from "../../util/Functions";
import { Navigate, useNavigate } from "react-router";

export default function Game({
    refreshDealerArray,
    dealerList,
    dealerName,
    outfitId,
    refresh,
    setRefresh,
}) {
    //useRef carries over between re-renders
    //access useRef items from {ref}.current
    const outfit = useRef({});
    const [currentImg, setCurrentImg] = useState({ image: "", idx: 0 });
    const [value, setValue] = useState(false);
    const navigate = useNavigate();

    let picRefArray = useRef([]);
    let imgInfo = useRef({ image: "", idx: 0 });
    let outfits = useRef([]);

    function advDealer() {
        if (currentImg.idx + 1 <= picRefArray.current.length - 1) {
            imgInfo = {
                image: picRefArray.current[currentImg.idx + 1],
                idx: currentImg.idx + 1,
            };
            setCurrentImg(imgInfo);
        } else if (outfits.current.length > 0) {
            picRefArray.current = [];
            outfits.current[0].pictures.forEach((pic) =>
                picRefArray.current.push(pic)
            );
            outfits.current.shift();
            setCurrentImg({
                image: picRefArray.current[0],
                idx: 0,
            });
        } else if (outfits.current.length === 0) {
            console.log("getting new dealer");
            let res = getNewDealer(
                dealerList,
                dealerName,
                outfitId,
                refreshDealerArray
            );
            if (res) {
                setCurrentImg({});
            } else {
                navigate("/end");
            }
        } else {
            console.log("you got another problem here");
        }
    }

    useEffect(() => {
        if (refreshDealerArray.current) {
            refreshDealerArray.current = false;
            picRefArray.current = [];
            console.log("dealerList.current", dealerList.current);
            if (!dealerName.current) {
                dealerName.current =
                    dealerList.current[
                        Math.floor(Math.random() * dealerList.current.length)
                    ];
            }
            console.log("dealerName.current", dealerName.current);
            fetch(`/api/play/${dealerName.current}`)
                .then((res) => res.json())
                .then((outfitInfo) => {
                    let current;
                    outfitInfo[1].forEach((outfit) => {
                        if (outfit.outfitId === outfitId.current) {
                            current = outfit;
                            outfit.pictures.forEach((pic) =>
                                picRefArray.current.push(pic)
                            );
                        } else {
                            outfits.current.push(outfit);
                        }
                    });

                    try {
                        dealerList.current.forEach((dealer, index) => {
                            if (dealer === outfitInfo[0].name) {
                                dealerList.current.splice(index, 1);
                            }
                        });
                    } catch (e) {
                        navigate("/end");
                    }
                    setCurrentImg({ image: current.pictures[0], idx: 0 });
                });
        }
    });

    return (
        <div className="game-container">
            <Cardtable advDealer={advDealer} value={value} />
            <GameDealer currentImg={currentImg} />
        </div>
    );
}
