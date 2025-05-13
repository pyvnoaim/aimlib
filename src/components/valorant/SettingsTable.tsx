import { ValorantSettings } from '@/types/valorant';
import { useState } from 'react';

interface SettingsTableProps {
  settings: ValorantSettings;
}

export default function SettingsTable({ settings }: SettingsTableProps) {
  const [activeTab, setActiveTab] = useState<
    'sensitivity' | 'crosshair' | 'resolution'
  >('sensitivity');

  const renderSensitivityTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-zinc-800 text-xs uppercase">
          <tr>
            <th className="px-6 py-3">Player</th>
            <th className="px-6 py-3">Sens</th>
            <th className="px-6 py-3">DPI</th>
            <th className="px-6 py-3">Hz</th>
            <th className="px-6 py-3">ADS</th>
          </tr>
        </thead>
        <tbody>
          {settings.sensitivities.map((sens, index) => (
            <tr key={index} className="border-b border-zinc-700">
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                  {sens.user}
                </span>
              </td>
              <td className="px-6 py-4">{sens.mouse}</td>
              <td className="px-6 py-4">{sens.dpi}</td>
              <td className="px-6 py-4">{sens.pollingRate}Hz</td>
              <td className="px-6 py-4">{sens.ads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCrosshairTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-zinc-800 text-xs uppercase">
          <tr>
            <th className="px-6 py-3">Player</th>
            <th className="px-6 py-3">Color</th>
            <th className="px-6 py-3">Code</th>
          </tr>
        </thead>
        <tbody>
          {settings.crosshairs.map((crosshair, index) => (
            <tr key={index} className="border-b border-zinc-700">
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                  {crosshair.user}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: crosshair.color }}
                  ></div>
                  {crosshair.color}
                </div>
              </td>
              <td className="px-6 py-4">{crosshair.crosshairCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderResolutionTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-zinc-800 text-xs uppercase">
          <tr>
            <th className="px-6 py-3">Player</th>
            <th className="px-6 py-3">Resolution</th>
            <th className="px-6 py-3">Refresh Rate</th>
            <th className="px-6 py-3">Aspect Ratio</th>
            <th className="px-6 py-3">Display Mode</th>
            <th className="px-6 py-3">True Stretch</th>
          </tr>
        </thead>
        <tbody>
          {settings.resolutions.map((res, index) => (
            <tr key={index} className="border-b border-zinc-700">
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                  {res.user}
                </span>
              </td>
              <td className="px-6 py-4">
                {res.width}x{res.height}
              </td>
              <td className="px-6 py-4">{res.refreshRate}Hz</td>
              <td className="px-6 py-4">{res.aspectRatio}</td>
              <td className="px-6 py-4">{res.displayMode}</td>
              <td className="px-6 py-4">{res.trueStretch ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900 rounded-lg shadow-xl overflow-hidden">
      <div className="flex border-b border-zinc-700">
        {(['sensitivity', 'crosshair', 'resolution'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeTab === 'sensitivity' && renderSensitivityTable()}
        {activeTab === 'crosshair' && renderCrosshairTable()}
        {activeTab === 'resolution' && renderResolutionTable()}
      </div>
    </div>
  );
}
