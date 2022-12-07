import React, { useState } from 'react';
import { Doughnut } from "react-chartjs-2";
import { useInjection } from "inversify-react";
import { Api } from "../graphql/api";
import { TokenomicsInfoType } from "../graphql/sdk";
import useAsyncEffect from "use-async-effect";
import { toBN } from "../utils/utils";

interface ITokenomicsPageProps {
}

const TokenomicsPage = ({}: ITokenomicsPageProps) => {
    const api = useInjection(Api);

    const [ tokenomicsInfo, setTokenomicsInfo ] = useState<TokenomicsInfoType>();

    useAsyncEffect(async () => {
        setTokenomicsInfo(await api.getTokenomicsInfo());
    }, []);

    return (
        <main className='main'>
            <section className="tokenomics-section">
                <div className="container">
                    <h2 className="section-title text-center">Tokenomics</h2>
                    <div className="chart-wrap">
                        <div className="chart-circle">
                            <Doughnut
                                data={{
                                    datasets: [{
                                        data: [
                                            toBN('110e12').toString(),
                                            toBN('1e15').minus('110e12').minus(tokenomicsInfo?.burnt),
                                            tokenomicsInfo?.burnt
                                        ],
                                        borderWidth: 5,
                                        borderRadius: 15,
                                        backgroundColor: ["#F49E40", "#F67C70", "#F3BC15"],
                                        borderColor: "white"
                                    },]
                                }}
                                options={{
                                    responsive: true,
                                }}
                            />
                        </div>
                        <div className="chart-label-wrap">
                            <div className="chart-label first">
                                <div className="label-color" style={{ backgroundColor: '#F49E40' }}/>
                                <div className="label-info">
                                    <span className="label-info-title">PancakeSwap liquidity</span>
                                    <span className="label-info-value">110 Trillion & all locked</span>
                                </div>
                            </div>
                            <div className="chart-label second">
                                <div className="label-color" style={{ backgroundColor: '#F67C70' }}/>
                                <div className="label-info">
                                    <span className="label-info-title">Circulating supply</span>
                                    <span className="label-info-value">{toBN('1e15').minus('110e12').minus(tokenomicsInfo?.burnt).integerValue().toString()} Trillion</span>
                                </div>
                            </div>
                            <div className="chart-label third">
                                <div className="label-color" style={{ backgroundColor: '#F3BC15' }}/>
                                <div className="label-info">
                                    <span className="label-info-title">Burned</span>
                                    <span className="label-info-value">{toBN(tokenomicsInfo?.burnt).div('1e12').integerValue().toString()} Trillion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tokenomic">
                        <div className="tokenomic__footer">
                            <div className="tokenomic__col">
                                <span className="tokenomic__text">TOKEN SYMBOL</span>
                                <span className="tokenomic__subtext">VANCAT</span>
                            </div>
                            <div className="tokenomic__col">
                                <span className="tokenomic__text">MAX SUPPLY</span>
                                <span className="tokenomic__subtext">1 Quadrillion</span>
                            </div>
                            <div className="tokenomic__col">
                                <span className="tokenomic__text">MARKET CAP</span>
                                <span className="tokenomic__subtext">$64,800,000</span>
                            </div>
                            <div className="tokenomic__col">
                                <span className="tokenomic__text">DECIMALS</span>
                                <span className="tokenomic__subtext">0</span>
                            </div>
                            <div className="tokenomic__col">
                                <span className="tokenomic__text">BURNED TODAY</span>
                                <span className="tokenomic__subtext">{parseInt(tokenomicsInfo?.burntDelta).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
};

export default TokenomicsPage;
