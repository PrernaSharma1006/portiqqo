import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'

function ComponentSelector({ availableComponents, activeComponents, onAddComponent, onClose }) {
  const inactiveComponents = Object.keys(availableComponents).filter(
    id => !activeComponents.includes(id)
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Components</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Choose components to add to your portfolio template.
            </p>
          </div>

          <div className="p-6">
            {inactiveComponents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Components Added</h3>
                <p className="text-gray-600">
                  You've already added all available components to your portfolio.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inactiveComponents.map((componentId) => {
                  const component = availableComponents[componentId]
                  return (
                    <motion.button
                      key={componentId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddComponent(componentId)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                          {component.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {component.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {component.description}
                          </p>
                          {component.required && (
                            <span className="inline-block mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-end">
                        <div className="flex items-center space-x-2 text-blue-600 group-hover:text-blue-700 font-medium">
                          <Plus className="w-4 h-4" />
                          <span>Add Component</span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ComponentSelector