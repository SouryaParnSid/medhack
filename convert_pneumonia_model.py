import tensorflowjs as tfjs
import tensorflow as tf

# Load the .h5 model
model = tf.keras.models.load_model('pneumonia_detection_model(1).h5')

# Convert and save the model
tfjs.converters.save_keras_model(model, 'public/models/pneumonia')
