const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

require('dotenv').config()
const axios = require('axios')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')

const flowVolver = addKeyword(['0', 'atras', 'atrás', 'cero']).addAction(
    [
        'Volviendo al menú principal...'
    ],
    { capture: true }, 
    async (ctx, { fallback }) =>{
        if(ctx.body=='0'){
            return flow.scene.leave();
        }
    },
)

const flowEstadoReclamo = addKeyword(['1', 'uno']).addAnswer(
    [
        'Somos una empresa especializada en la reparación, instalación y mantenimiento de equipos médicos. Contamos con un equipo de profesionales altamente calificados y con amplia experiencia en el sector, lo que nos permite ofrecer un servicio integral y de calidad a nuestros clientes.',
        '\nNuestra misión es brindar a nuestros clientes soluciones eficientes y oportunas a sus necesidades de reparación, instalación y mantenimiento de equipos médicos, contribuyendo así al buen funcionamiento de las instituciones de salud y al bienestar de sus pacientes.',
        '\nNuestra visión es ser la empresa líder en el sector de reparación, instalación y mantenimiento de equipos médicos en la región, reconocida por la calidad de nuestros servicios, la atención personalizada a nuestros clientes y nuestro compromiso con la seguridad y la eficiencia.',
        '\n*0* Para volver al menú anterior.',
        '\n*1* Para finalizar este chat.',
    ],
    {capture:true},
    async (ctx,{flowDynamic, endFlow, scene})=>{
        if(ctx.body=='1'){
            return endFlow({body:'¡Gracias por chatear con nosotros!'}); 
        }else if(ctx.body=='0'){
            return ctx.leave()
        }
        const numReclamo=ctx.body
    },
    [flowVolver]
)

const flowOlvideContraseña = addKeyword(['2', 'dos']).addAnswer(
    [
        'Contamos con una amplia gama de servicios para atender las necesidades de nuestros clientes.',
        '\n1. Reparación de equipos médicos de todas las marcas y modelos.',
        '\n2. Instalación de equipos médicos nuevos y usados.',
        '\n3. Mantenimiento preventivo y correctivo de equipos médicos.',
        '\n*0* Para volver al menú anterior.',
        '\n*1* Para finalizar este chat.',
    ],
    {capture:true},
    async (ctx,{flowDynamic, endFlow, scene})=>{
        if(ctx.body=='1'){
            return endFlow({body:'¡Gracias por chatear con nosotros!'}); 
        }else if(ctx.body=='0'){
            return ctx.leave()
        }
        const numReclamo=ctx.body
    },
    [flowVolver]
)

const flowSoporteTecnico = addKeyword(['3', 'tres']).addAnswer(
    [
        'Nuestras oficinas se encuentran ubicadas en la Avenida Venezuela, esquina de la calle 10, local B-06',
        '\nNuestro horario de atención es: Lunes a viernes de 8:00 AM a 5:00 PM',
        '\n*0* Para volver al menú anterior.',
        '\n*1* Para finalizar este chat.',
    ],
    {capture:true},
    async (ctx,{flowDynamic, endFlow, scene})=>{
        if(ctx.body=='1'){
            return endFlow({body:'¡Gracias por chatear con nosotros!'}); 
        }else if(ctx.body=='0'){
            return ctx.leave()
        }
        const numReclamo=ctx.body
    },
    [flowVolver]
)

const flowPromociones = addKeyword(['4','cuatro']).addAnswer(
    [
        '¡Claro! Nuestro personal de soporte técnico está disponble para atender tus dudas de lunes a viernes en horario de 8:00 AM a 5:00 PM',
        '\nLos contactos son: ',
        '\n📞 +584245560065',
        '📞 +584264554652',
        '📞 +584127624698',
    ],
    {capture:true},
    async (ctx,{flowDynamic, endFlow, scene})=>{
        if(ctx.body=='1'){
            return endFlow({body:'¡Gracias por chatear con nosotros!'}); 
        }else if(ctx.body=='0'){
            return ctx.leave()
        }
        const numReclamo=ctx.body
    },
    [flowVolver]
)

const flowPrincipal = addKeyword(['Hola', 'Buenas', 'Alo'])
    .addAnswer('🙌 Hola bienvenido al Asistente Virtual de *VitalFix*')
    .addAnswer(
        [
            '¿Qué deseas hacer?',
            '👉 *1*  ¿Quiénes son? 🤔',
            '👉 *2*  ¿Qué servicios ofrecen? 📋',
            '👉 *3*  ¿Dónde se encuentran\nubicados? 📍',
            '👉 *4*  Quiero hablar con soporte\ntécnico ⚙️',
            '👉 *5*  Salir de este chat 👋',
        ],
        {capture:true},
        async (ctx, {fallback, endFlow})=>{
            if(ctx.body=='1'){
                return flowEstadoReclamo;
            }else if(ctx.body=='2'){
                return flowOlvideContraseña;
            }else if(ctx.body=='3'){
                return flowSoporteTecnico;
            }else if(ctx.body=='4'){
                return flowPromociones;
            }else if(ctx.body=='5'){
                return endFlow({body:'¡Gracias por chatear con nosotros!'});
            }
            return fallback();
            console.log('Mensaje entrante: ', ctx.body)
        },
        [flowEstadoReclamo, flowOlvideContraseña, flowSoporteTecnico, flowPromociones]
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()