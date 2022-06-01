rm -rf ./system
rm -rf ./portal
rm -rf ./gateway
rm -rf ./node

git clone --depth=1 https://bitbucket.org/sting/beez-system.git system
git clone --depth=1 https://bitbucket.org/sting/beez-portal.git portal
git clone --depth=1 https://bitbucket.org/sting/beez-gateway.git gateway
git clone --depth=1 https://bitbucket.org/sting/beez-node.git node

rm -rf ./system/.git
rm -rf ./portal/.git
rm -rf ./gateway/.git
rm -rf ./node/.git
