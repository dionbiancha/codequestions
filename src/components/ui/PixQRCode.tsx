'use client'

import { QRCodeSVG } from 'qrcode.react'

const PIX_PAYLOAD =
  '00020126580014BR.GOV.BCB.PIX0136758363cb-5d38-4d86-a011-1361de58bd7b5204000053039865802BR5916Dionei Bianchati6009SAO PAULO62140510cKA90F3yn16304FEDD'

export function PixQRCode() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-3 rounded-lg">
        <QRCodeSVG
          value={PIX_PAYLOAD}
          size={160}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      </div>
      <p className="text-xs font-mono text-dark-muted">pix@dionei.com</p>
    </div>
  )
}
