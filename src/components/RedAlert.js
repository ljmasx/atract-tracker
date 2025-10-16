import React from 'react';
import { AlertCircle } from 'lucide-react';
import { RETURN_ADDRESS } from '../utils/constants';

/**
 * High-visibility red alert for defective devices
 * Displays cleaning instructions and return shipping address
 */
const RedAlert = () => (
  <div className="bg-red-600 text-white p-4 rounded-lg border-4 border-red-700 my-4 animate-pulse">
    <div className="flex items-center gap-3">
      <AlertCircle className="w-8 h-8 flex-shrink-0" />
      <div>
        <p className="font-bold text-lg tracking-wide mb-2">
          ⚠️ DISPOSITIF DÉFECTUEUX - RETOUR OBLIGATOIRE
        </p>
        <p className="text-sm mb-2">
          À nettoyer avec détergent / formol avant envoi
        </p>
        <p className="text-sm">
          Conservez le dispositif et envoyez-le par courrier à :
        </p>
        <p className="font-semibold mt-1">
          {RETURN_ADDRESS.name}<br />
          {RETURN_ADDRESS.street}<br />
          {RETURN_ADDRESS.city}
        </p>
      </div>
    </div>
  </div>
);

export default RedAlert;
