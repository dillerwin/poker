export function getNewDealer(
    dealerList,
    dealerName,
    outfitId,
    refreshDealerArray
) {
    try {
        dealerName.current =
            dealerList.current[
                Math.floor(Math.random() * dealerList.current.length)
            ];

        let nameChange = dealerName.current.split(" ");
        nameChange.push("1");
        outfitId.current = nameChange.join("");

        refreshDealerArray.current = true;
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
}
