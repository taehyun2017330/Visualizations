"""
Implementation of the AmbReducer algorithm.
Automatically reduce the cluster ambiguity of dimensionality reduction algorithm while maintaining the original sufficient accuracy
"""

import numpy as np
import CLAMS as clams
from snc.snc import SNC
from bayes_opt import BayesianOptimization

import umap
from sklearn.manifold import TSNE

class AmbReducer():
	"""
	Ambreducer class
	"""

	def __init__(self, method="umap", metric="snc", threshold_loss=0.05, S=3.0, verbose=0, init_points=8, n_iter=40):
		"""
		Get the method and metric that want to be optimized
		"""
		supported_method = ["tsne", "umap"]
		supported_metric = ["snc", "tnc"]

		self.hyperparameter_range = {
			"tsne": {
				"perplexity": (1, 1000),
			},
			"umap": {
				"n_neighbors": (2, 200),
				"min_dist": (0.0, 1.0),
			}
		}

		if method not in supported_method:
			raise ValueError("Method not supported")
		if metric not in supported_metric:
			raise ValueError("Metric not supported")
		
		self.method = method
		self.metric = metric
		self.threshold_loss = threshold_loss
		self.verbose = verbose
		self.S = S
		self.init_points = init_points
		self.n_iter = n_iter

	def fit(self, raw, emb):
		"""
		Get the original data and the reduced data generated by a certain dimensionality reduction algorithm
		"""
		self.raw = raw
		self.emb = emb
	
	def __get_loss(self, raw, emb):
		if self.metric == "snc":			
			metrics = SNC(raw, emb, iteration=300, walk_num_ratio=0.4)
			metrics.fit()
			stead, cohev = metrics.steadiness(), metrics.cohesiveness()
			return (2 * (stead * cohev)) / (stead + cohev)
		elif self.metric == "tnc":
			pass

	def optimize(self):
		"""
		Run the bayesian optimization for optimizing DR embedding
		"""
		def __get_loss_wrapper(**kwargs):
			"""
			Optimizer function
			"""
			if self.method == "tsne":
				new_emb = TSNE(n_components=2, perplexity=kwargs["perplexity"], init=self.emb).fit_transform(self.raw)
			elif self.method == "umap":
				new_emb = umap.UMAP(n_components=2, n_neighbors=int(kwargs["n_neighbors"]), min_dist=kwargs["min_dist"], init=self.emb).fit_transform(self.raw)
			new_loss =  self.__get_loss(self.raw, new_emb) 

			if self.init_loss - new_loss > self.threshold_loss:
				return 0 
			else:
				ca = clams.ClusterAmbiguity(verbose=self.verbose, S=self.S)
				score = ca.fit(new_emb)
				return 1 - score   ## note that cluster ambiguity is lower the better


		### get initial loss
		self.init_loss = self.__get_loss(self.raw, self.emb)
		self.threshold_loss = self.init_loss * self.threshold_loss

		### get initial ambiguity
		ca = clams.ClusterAmbiguity(verbose=self.verbose, S=self.S)
		self.initial_ambiguity = ca.fit(self.emb)

		optimizer = BayesianOptimization(
			f=__get_loss_wrapper,
			pbounds=self.hyperparameter_range[self.method],
			random_state=0,
			verbose=self.verbose
		)

		optimizer.maximize(init_points=self.init_points, n_iter=self.n_iter)

		
		self.max_hyperparameter = optimizer.max["params"]
		if self.method == "tsne":
			self.new_emb = TSNE(n_components=2, perplexity=self.max_hyperparameter["perplexity"], init=self.emb).fit_transform(self.raw)
		elif self.method == "umap":
			self.new_emb = umap.UMAP(n_components=2, n_neighbors=int(self.max_hyperparameter["n_neighbors"]), min_dist=self.max_hyperparameter["min_dist"], init=self.emb).fit_transform(self.raw)

		self.final_loss = self.__get_loss(self.raw, self.new_emb)
		
		
		ca_final = clams.ClusterAmbiguity(verbose=self.verbose, S=self.S)
		self.final_ambiguity = ca_final.fit(self.new_emb)	
	
	def get_new_emb(self):
		return self.new_emb
	
	def get_infos(self):
		return {
			"init_emb": self.emb,
			"final_emb": self.new_emb,
			"init_loss": self.init_loss,
			"final_loss": self.final_loss,
			"max_hyperparameter": self.max_hyperparameter,
			"initial_embiguity": self.initial_ambiguity,
			"final_ambiguity": self.final_ambiguity
		}


		

	
	
	