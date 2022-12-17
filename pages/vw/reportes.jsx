import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Estilos
import styles from "../../styles/pages/reportes.module.scss";
// Componentes
import Layout from '../../components/Layout';
import PieChart from '../../components/charts/PieChart';
import { BarChart } from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import { Chart, registerables } from 'chart.js';
// Funciones externas
import { MasRecienteProducto, ModalidadInforme, RegistradosPorMes, RVOEInforme, StatusInforme, TipoOfertaInforme } from '../../utils/reportes';

Chart.register(...registerables);

const Reportes = () => {
    const [chartData, setChartData] = useState(null);
    const [GraphicIndex, setGraphicIndex] = useState(0);
    const [Cargando, setCargando] = useState(true);
    const [DataSAE, setDataSAE] = useState([]);
    const [DataARTEK, setDataARTEK] = useState([]);
    const [UltimoProducto, setUltimoProducto] = useState([]);

    useEffect(() => {
        // document.querySelector("body").className = '';
        // document.querySelector("body").classList.add("reportes_bg");
        if (Cargando) {
            getProductosDataset();
        }
    }, [chartData]);

    const getProductosDataset = async () => {
        let ARTEK = [];
        let SAE = [];
        await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/artek`).then((res) => {
            ARTEK = res.data;
            setDataARTEK(ARTEK);
        });
        await axios(`${process.env.NEXT_PUBLIC_ENDPOINT}api/productos/sae`).then((res) => {
            SAE = res.data;
            setDataSAE(SAE);
        });
        setCargando(false);
        requestInforme(SAE, ARTEK, 'perMonth');
        setUltimoProducto(MasRecienteProducto(SAE, ARTEK));
    }

    const loadDataset = (SAE, ARTEK, labelsArray) => setChartData({
        labels: labelsArray,
        datasets: [
            {
                label: "SAE",
                data: SAE,
                backgroundColor: [
                    "#241178",
                    "#2510a3",
                    "#673dff",
                    "#101084",
                    "#0044d0"
                ],
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                // tension: 0.4
            },
            {
                label: "ARTEK",
                data: ARTEK,
                backgroundColor: [
                    "#241178",
                    "#2510a3",
                    "#673dff",
                    "#101084",
                    "#0044d0"
                ],
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                // tension: 0.4
            }
        ]
    });

    const requestInforme = (SAE, ARTEK, datoSolicitado) => {
        switch (datoSolicitado) {
            case 'statusProducto':
                const status = StatusInforme(SAE, ARTEK);
                loadDataset(status[0].dataset, status[1].dataset, status[0].labels);
                break;
            case 'modalidad':
                const modalidad = ModalidadInforme(SAE, ARTEK);
                loadDataset(modalidad[0].dataset, modalidad[1].dataset, modalidad[0].labels);
                break;
            case 'tipo':
                const tipo = TipoOfertaInforme(SAE, ARTEK);
                loadDataset(tipo[0].dataset, tipo[1].dataset, tipo[0].labels);
                break;
            case 'RVOE':
                const RVOE = RVOEInforme(SAE, ARTEK);
                loadDataset(RVOE[0].dataset, RVOE[1].dataset, RVOE[0].labels);
                break;
            case 'perMonth':
                const meses = RegistradosPorMes(SAE, ARTEK);
                loadDataset(meses[0].dataset, meses[1].dataset, meses[0].labels);
                break;
            default:
                break;
        }
    }

    if (Cargando && chartData === null || UltimoProducto === []) {
        return <h1>Cargando...</h1>
    }

    return <>
        <Layout>
            <Head>
                <title>Reportes</title>
                <meta name="description" content="Start app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <div className={styles.graphics_area}>
                    <div className={styles.bar_action}>
                        <button onClick={() => setGraphicIndex(0)} className={GraphicIndex === 0 ? styles.active : null}>Gráfico circular</button>
                        <button onClick={() => setGraphicIndex(1)} className={GraphicIndex === 1 ? styles.active : null}>Gráfico de barras</button>
                        <button onClick={() => setGraphicIndex(2)} className={GraphicIndex === 2 ? styles.active : null}>Gráfico linear</button>
                    </div>
                    <select name="dataToBring" onChange={(e) => requestInforme(DataSAE, DataARTEK, e.target.value)}>
                        <option value="perMonth">Registrados por mes</option>
                        <option value="statusProducto">Estatus</option>
                        <option value="modalidad">Modalidad</option>
                        <option value="tipo">Tipo de oferta</option>
                        <option value="RVOE">RVOE</option>
                    </select>
                    {GraphicIndex === 0 ? <PieChart chartData={chartData} /> : null}
                    {GraphicIndex === 1 ? <BarChart chartData={chartData} /> : null}
                    {GraphicIndex === 2 ? <LineChart chartData={chartData} /> : null}
                </div>
                <div className={styles.most_active_users}>
                    <h2>Usuarios con más registros</h2>
                </div>
                <div className={styles.sae_number_products}>
                    <h2>Productos SAE</h2>
                    <div className={styles.box_info}>
                        <h3>{DataSAE.length}</h3>
                        <div className={styles.box}>
                            <h3>Más reciente:</h3>
                            <p>&nbsp;{UltimoProducto[0].nombre}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.artek_number_products}>
                    <h2>Productos ARTEK</h2>
                    <div className={styles.box_info}>
                        <h3>{DataARTEK.length}</h3>
                        <div className={styles.box}>
                            <h3>Más reciente:</h3>
                            <p>&nbsp;{UltimoProducto[1].nombre}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.numbers_of_users}>
                    <h2>Número de usuarios</h2>
                    <p>Administradores: 5</p>
                    <p>Staff: 7</p>
                    <p>Docentes: 45</p>
                </div>
            </div>
        </Layout>
    </>
}

export default Reportes;

export async function getServerSideProps(ctx) {
    const _session = await getSession(ctx);

    if (!_session) return {
        redirect: {
            destination: '/',
            permanent: false
        }
    }

    return {
        props: {
        }
    }
}
