'use strict'
const fs = require('fs')
const path = require('path')
const pify = require('pify')
const mkdirp = require('mkdirp')
const dotProp = require('dot-prop')

function resolvePkg(dir) {
	dir = dir || './'
	return path.resolve(dir, 'package.json')
}

module.exports = class Pkg {
	constructor(cwd) {
		this.pkg = resolvePkg(cwd)
		try {
			this.data = require(this.pkg)
		} catch (err) {
			if (err.code === 'ENOENT') {
				mkdirp.sync(this.pkg)
				this.data = {}
			}
		}
	}

	set(prop, value) {
		dotProp.set(this.data, prop, value)
		return this
	}

	get(prop) {
		return dotProp.get(this.data, prop)
	}

	save() {
		return pify(fs.writeFile)(this.pkg, JSON.stringify(this.data, null, 2), 'utf8')
	}

	saveSync() {
		fs.writeFileSync(this.pkg, JSON.stringify(this.data, null, 2), 'utf8')
		return this
	}
}
