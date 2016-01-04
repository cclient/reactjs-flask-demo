import database

col = database.getDB("auditserver", "pcaip");


def findbyid(id):
    return col.find_one({"_id": id})


def findbypca(id):
    return findbyid(id)


def insert(insertdoc):
    return col.insert_one(insertdoc).inserted_id


def update(id, updatedoc):
    res = col.update_one({"_id": id}, {"$set": updatedoc})
    if res.modified_count > 0:
        return True
    else:
        return False


def delete(id):
    res = col.delete_one({"_id": id})
    if res.deleted_count > 0:
        return True
    else:
        return False


def list(query):
    arr = []
    for ap in col.find(query):
        arr.append(ap)
    return arr

# return col.find(query).limit()
