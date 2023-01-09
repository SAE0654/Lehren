import { getSession } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
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
import { getProductosByInstitution } from '../../services/productos';

Chart.register(...registerables);

const Reportes = () => {
    const [chartData, setChartData] = useState(null);
    const [GraphicIndex, setGraphicIndex] = useState(0);
    const [Cargando, setCargando] = useState(true);
    const [DataSAE, setDataSAE] = useState([]);
    const [DataARTEK, setDataARTEK] = useState([]);
    const [UltimoProducto, setUltimoProducto] = useState([]);
    const [Year, setYear] = useState('2023');

    const select_type = useRef(null);

    useEffect(() => {
        document.querySelector("body").className = '';
        document.querySelector("body").classList.add('consultas_bg');
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
        const dataSAE = await getProductosByInstitution("sae");
        SAE = dataSAE;
        setDataSAE(dataSAE)
        setCargando(false);
        requestInforme(SAE, ARTEK, 'perMonth2023');
        setUltimoProducto(MasRecienteProducto(SAE, ARTEK));
    }

    const loadDataset = (SAE, ARTEK, labelsArray) => setChartData({
        labels: labelsArray,
        datasets: [
            {
                label: "SAE",
                data: SAE,
                backgroundColor: [
                    "#50899c",
                    "#3197b9",
                    "#2a809d",
                    "#1898af",
                    "#50899c"
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
            case 'perMonth2022':
                const meses2022 = RegistradosPorMes(SAE, ARTEK, '2022');
                loadDataset(meses2022[0].dataset, meses2022[1].dataset, meses2022[0].labels);
                setYear('2022');
                break;
            case 'perMonth2023':
                const meses2023 = RegistradosPorMes(SAE, ARTEK, '2023');
                loadDataset(meses2023[0].dataset, meses2023[1].dataset, meses2023[0].labels);
                setYear('2023');
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
                <link rel="icon" href="/favicon-33.ico" />
            </Head>
            <div className={styles.container}>
                <div className={styles.graphics_area}>
                    <div className={styles.bar_action}>
                        <button onClick={() => setGraphicIndex(0)} className={GraphicIndex === 0 ? styles.active : null}>Gráfico circular</button>
                        <button onClick={() => setGraphicIndex(1)} className={GraphicIndex === 1 ? styles.active : null}>Gráfico de barras</button>
                        <button onClick={() => setGraphicIndex(2)} className={GraphicIndex === 2 ? styles.active : null}>Gráfico linear</button>
                    </div>
                    <select onChange={(e) => requestInforme(DataSAE, DataARTEK, e.target.value)} ref={select_type}>
                        <option value={"perMonth" + Year}>Registrados por mes</option>
                        <option value="statusProducto">Estatus</option>
                        <option value="modalidad">Modalidad</option>
                        <option value="tipo">Tipo de oferta</option>
                        <option value="RVOE">RVOE</option>
                    </select>
                    {GraphicIndex === 0 ? <PieChart chartData={chartData} /> : null}
                    {GraphicIndex === 1 ? <BarChart chartData={chartData} /> : null}
                    {GraphicIndex === 2 ? <LineChart chartData={chartData} /> : null}
                    <select className={styles.year_select} onChange={(e) => (requestInforme(DataSAE, DataARTEK, e.target.value), select_type.current.selectedIndex = 0)}>
                        <option value="perMonth2023">2023</option>
                        <option value="perMonth2022">2022</option>
                    </select>
                </div>
                <div className={styles.most_active_users}>
                    <h2>Otra área</h2>
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
                    <h2>Otra área</h2>
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
